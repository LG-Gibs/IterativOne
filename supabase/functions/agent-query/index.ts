import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AgentQuery {
  sessionId: string;
  agentName: string;
  query: string;
  context?: Record<string, any>;
}

interface AgentResponse {
  result: string;
  data?: any;
  vestedInterestDelta?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const query: AgentQuery = await req.json();

    if (!query.sessionId || !query.agentName || !query.query) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: sessionId, agentName, query",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response: AgentResponse = {
      result: `Agent ${query.agentName} processed query: "${query.query}"`,
      data: query.context || {},
      vestedInterestDelta: 1,
    };

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Agent query error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to process agent query",
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
