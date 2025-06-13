/*
  # Complete database schema setup

  1. New Tables
    - `topics` - Learning topics/subjects
    - `quests` - Individual quest levels within topics  
    - `quiz_attempts` - User quiz attempt records
    - `user_quest_progress` - User progress tracking
    - `quoll_shouts` - Community posts/shouts

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
    - Ensure proper access control

  3. Performance
    - Add indexes for frequently queried columns
    - Optimize for user-specific queries
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can read topics" ON topics;
DROP POLICY IF EXISTS "Authenticated users can create topics" ON topics;
DROP POLICY IF EXISTS "Users can update own topics" ON topics;
DROP POLICY IF EXISTS "Public can read quests" ON quests;
DROP POLICY IF EXISTS "Authenticated users can manage quests" ON quests;
DROP POLICY IF EXISTS "Users can create own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can read own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can manage own quest progress" ON user_quest_progress;
DROP POLICY IF EXISTS "Users can read own quest progress" ON user_quest_progress;
DROP POLICY IF EXISTS "Public can read quoll shouts" ON quoll_shouts;
DROP POLICY IF EXISTS "Users can create own shouts" ON quoll_shouts;
DROP POLICY IF EXISTS "Users can update own shouts" ON quoll_shouts;

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create quests table
CREATE TABLE IF NOT EXISTS quests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  level integer NOT NULL,
  is_unlocked boolean DEFAULT false,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  score integer NOT NULL,
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Create user_quest_progress table
CREATE TABLE IF NOT EXISTS user_quest_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id uuid REFERENCES quests(id) ON DELETE CASCADE,
  status text DEFAULT 'locked' NOT NULL,
  score integer,
  completed_at timestamptz,
  CONSTRAINT user_quest_progress_status_check CHECK (status IN ('locked', 'unlocked', 'completed'))
);

-- Create quoll_shouts table with proper foreign key to users table
CREATE TABLE IF NOT EXISTS quoll_shouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  achievement_type text,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quoll_shouts ENABLE ROW LEVEL SECURITY;

-- Topics policies
CREATE POLICY "Public can read topics"
  ON topics
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create topics"
  ON topics
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own topics"
  ON topics
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Quests policies
CREATE POLICY "Public can read quests"
  ON quests
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage quests"
  ON quests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Quiz attempts policies
CREATE POLICY "Users can create own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- User quest progress policies
CREATE POLICY "Users can manage own quest progress"
  ON user_quest_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own quest progress"
  ON user_quest_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Quoll shouts policies
CREATE POLICY "Public can read quoll shouts"
  ON quoll_shouts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create own shouts"
  ON quoll_shouts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shouts"
  ON quoll_shouts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS topics_user_id_idx ON topics(user_id);
CREATE INDEX IF NOT EXISTS topics_is_popular_idx ON topics(is_popular);

CREATE INDEX IF NOT EXISTS quests_topic_id_idx ON quests(topic_id);
CREATE INDEX IF NOT EXISTS quests_level_idx ON quests(level);

CREATE INDEX IF NOT EXISTS quiz_attempts_user_id_idx ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_quest_id_idx ON quiz_attempts(quest_id);

CREATE INDEX IF NOT EXISTS user_quest_progress_user_id_idx ON user_quest_progress(user_id);
CREATE INDEX IF NOT EXISTS user_quest_progress_quest_id_idx ON user_quest_progress(quest_id);
CREATE INDEX IF NOT EXISTS user_quest_progress_status_idx ON user_quest_progress(status);

CREATE INDEX IF NOT EXISTS quoll_shouts_user_id_idx ON quoll_shouts(user_id);
CREATE INDEX IF NOT EXISTS quoll_shouts_created_at_idx ON quoll_shouts(created_at);