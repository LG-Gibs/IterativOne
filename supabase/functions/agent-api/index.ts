import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BrowserCommand {
  type: string;
  sessionId: string;
  tabId?: string;
  url?: string;
  muted?: boolean;
}

interface DelegationRequest {
  sessionId: string;
  agentName: string;
  taskName: string;
  taskDescription?: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

async function handleBrowserCommand(command: BrowserCommand) {
  const { sessionId, type, tabId, url, muted } = command;

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Session not found");
  }

  const eventData: Record<string, any> = {
    command_type: type,
    timestamp: new Date().toISOString(),
  };

  if (tabId) eventData.tab_id = tabId;
  if (url) eventData.url = url;
  if (muted !== undefined) eventData.muted = muted;

  const { error: eventError } = await supabase.from("browser_events").insert({
    session_id: sessionId,
    event_type: `command:${type}`,
    event_data: eventData,
  });

  if (eventError) {
    throw new Error(`Failed to record event: ${eventError.message}`);
  }

  return { success: true, command_type: type };
}

async function handleTaskDelegation(request: DelegationRequest) {
  const { sessionId, agentName, taskName, taskDescription } = request;

  const { data: agentSession, error: agentError } = await supabase
    .from("agent_sessions")
    .select("*")
    .eq("session_id", sessionId)
    .eq("agent_name", agentName)
    .single();

  if (agentError || !agentSession) {
    throw new Error(`Agent session not found for ${agentName}`);
  }

  const { data: delegation, error: delegationError } = await supabase
    .from("agent_delegations")
    .insert({
      agent_session_id: agentSession.id,
      task_name: taskName,
      task_description: taskDescription,
      status: "pending",
    })
    .select()
    .single();

  if (delegationError) {
    throw new Error(`Failed to create delegation: ${delegationError.message}`);
  }

  return delegation;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  const url = new URL(req.url);
  const pathname = url.pathname;

  try {
    if (pathname.endsWith("/agent-api/command") && req.method === "POST") {
      const command: BrowserCommand = await req.json();
      const result = await handleBrowserCommand(command);

      return new Response(JSON.stringify(result), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname.endsWith("/agent-api/delegate") && req.method === "POST") {
      const request: DelegationRequest = await req.json();
      const result = await handleTaskDelegation(request);

      return new Response(JSON.stringify(result), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname.endsWith("/agent-api/health") && req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found" }),
      {
        status: 404,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Agent API error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
