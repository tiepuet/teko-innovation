/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - full_name (text)
      - email (text, unique)
      - role (text)
      - created_at (timestamptz)
    - events
      - id (uuid, primary key)
      - name (text)
      - slogan (text)
      - description (text)
      - image_url (text)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - status (text)
      - visibility (text)
      - created_by (uuid, references users)
      - created_at (timestamptz)
    - ideas
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - user_id (uuid, references users)
      - title (text)
      - description (text)
      - status (text)
      - created_at (timestamptz)
    - teams
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - name (text)
      - status (text)
      - created_at (timestamptz)
    - team_members
      - id (uuid, primary key)
      - team_id (uuid, references teams)
      - user_id (uuid, references users)
      - role (text)
      - joined_at (timestamptz)
    - projects
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - team_id (uuid, references teams)
      - idea_id (uuid, references ideas)
      - presentation_time (timestamptz)
      - code_url (text)
      - slide_url (text)
      - demo_url (text)
      - created_at (timestamptz)
    - scoring_criteria
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - name (text)
      - weight (numeric)
      - max_score (numeric)
      - created_at (timestamptz)
    - judges
      - id (uuid, primary key)
      - event_id (uuid, references events)
      - user_id (uuid, references users)
      - created_at (timestamptz)
    - scores
      - id (uuid, primary key)
      - project_id (uuid, references projects)
      - criterion_id (uuid, references scoring_criteria)
      - judge_id (uuid, references judges)
      - score (numeric)
      - feedback (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slogan text,
  description text,
  image_url text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  visibility text NOT NULL DEFAULT 'private',
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id),
  idea_id uuid REFERENCES ideas(id),
  presentation_time timestamptz,
  code_url text,
  slide_url text,
  demo_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scoring_criteria (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  weight numeric NOT NULL,
  max_score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS judges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  criterion_id uuid REFERENCES scoring_criteria(id),
  judge_id uuid REFERENCES judges(id),
  score numeric NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public events are visible to all" ON events
  FOR SELECT TO authenticated
  USING (visibility = 'public' OR created_by = auth.uid());

CREATE POLICY "Ideas are visible to event participants" ON ideas
  FOR SELECT TO authenticated
  USING (
    event_id IN (
      SELECT e.id FROM events e
      WHERE e.visibility = 'public'
      OR e.created_by = auth.uid()
      OR EXISTS (
        SELECT 1 FROM team_members tm
        JOIN teams t ON t.id = tm.team_id
        WHERE t.event_id = ideas.event_id
        AND tm.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Teams are visible to event participants" ON teams
  FOR SELECT TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE visibility = 'public'
      OR created_by = auth.uid()
    )
  );

CREATE POLICY "Team members can be viewed by team members" ON team_members
  FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT id FROM teams
      WHERE event_id IN (
        SELECT id FROM events
        WHERE visibility = 'public'
        OR created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Projects are visible to event participants" ON projects
  FOR SELECT TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE visibility = 'public'
      OR created_by = auth.uid()
    )
  );

CREATE POLICY "Scoring criteria are visible to event participants" ON scoring_criteria
  FOR SELECT TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE visibility = 'public'
      OR created_by = auth.uid()
    )
  );

CREATE POLICY "Judges can be viewed by event participants" ON judges
  FOR SELECT TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events
      WHERE visibility = 'public'
      OR created_by = auth.uid()
    )
  );

CREATE POLICY "Scores can be viewed by event participants" ON scores
  FOR SELECT TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE event_id IN (
        SELECT id FROM events
        WHERE visibility = 'public'
        OR created_by = auth.uid()
      )
    )
  );