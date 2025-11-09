/*
  # Browser Integration Schema for IterativOne

  1. New Tables
    - `sessions` - User browser sessions with agent context
    - `browser_contexts` - Individual browser window/tab contexts
    - `agent_sessions` - Agent conversation history and state
    - `browser_events` - Event log for debugging and replay
    - `agent_delegations` - Track agent task assignments
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access only their data
    - Add policies for agents to access session data they own
  
  3. Features
    - Track VestedInterest™ scores per user-agent relationship
    - Support for multi-agent collaboration
    - Event history for reconstruction
*/

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  browser_type text DEFAULT 'chromium',
  connection_status text DEFAULT 'disconnected',
  api_url text,
  ws_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, id)
);

CREATE TABLE IF NOT EXISTS browser_contexts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  context_type text DEFAULT 'window',
  title text,
  url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  agent_name text NOT NULL,
  agent_type text NOT NULL,
  vested_interest_score decimal DEFAULT 0,
  context_data jsonb DEFAULT '{}',
  memory_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS browser_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  context_id uuid REFERENCES browser_contexts(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_delegations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_session_id uuid REFERENCES agent_sessions(id) ON DELETE CASCADE NOT NULL,
  task_name text NOT NULL,
  task_description text,
  status text DEFAULT 'pending',
  result jsonb,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE browser_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_delegations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view contexts in own sessions"
  ON browser_contexts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = browser_contexts.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert contexts in own sessions"
  ON browser_contexts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = browser_contexts.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own contexts"
  ON browser_contexts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = browser_contexts.session_id
      AND sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = browser_contexts.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view agent sessions in own sessions"
  ON agent_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = agent_sessions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create agent sessions in own sessions"
  ON agent_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = agent_sessions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own agent sessions"
  ON agent_sessions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = agent_sessions.session_id
      AND sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = agent_sessions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view events from own sessions"
  ON browser_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = browser_events.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert events in own sessions"
  ON browser_events FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = browser_events.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view delegations from own agent sessions"
  ON agent_delegations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_sessions
      JOIN sessions ON sessions.id = agent_sessions.session_id
      WHERE agent_sessions.id = agent_delegations.agent_session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create delegations in own agent sessions"
  ON agent_delegations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_sessions
      JOIN sessions ON sessions.id = agent_sessions.session_id
      WHERE agent_sessions.id = agent_delegations.agent_session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update delegations in own agent sessions"
  ON agent_delegations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM agent_sessions
      JOIN sessions ON sessions.id = agent_sessions.session_id
      WHERE agent_sessions.id = agent_delegations.agent_session_id
      AND sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM agent_sessions
      JOIN sessions ON sessions.id = agent_sessions.session_id
      WHERE agent_sessions.id = agent_delegations.agent_session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_browser_contexts_session_id ON browser_contexts(session_id);
CREATE INDEX idx_agent_sessions_session_id ON agent_sessions(session_id);
CREATE INDEX idx_browser_events_session_id ON browser_events(session_id);
CREATE INDEX idx_agent_delegations_agent_session_id ON agent_delegations(agent_session_id);
