/*
  # Create missing tables for quest system

  1. New Tables
    - `topics`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text, not null)
      - `user_id` (uuid, foreign key to auth.users)
      - `is_popular` (boolean, default false)
      - `created_at` (timestamp)
    - `quests`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key to topics)
      - `level` (integer, not null)
      - `is_unlocked` (boolean, default false)
      - `is_completed` (boolean, default false)
      - `created_at` (timestamp)
    - `quiz_attempts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `quest_id` (uuid, foreign key to quests)
      - `score` (integer, not null)
      - `answers` (jsonb, not null)
      - `completed_at` (timestamp)
    - `user_quest_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `quest_id` (uuid, foreign key to quests)
      - `status` (text, check constraint)
      - `score` (integer, nullable)
      - `completed_at` (timestamp, nullable)
    - `quoll_shouts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text, not null)
      - `achievement_type` (text, nullable)
      - `likes_count` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

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
  status text NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked', 'completed')),
  score integer,
  completed_at timestamptz
);

-- Create quoll_shouts table
CREATE TABLE IF NOT EXISTS quoll_shouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  achievement_type text,
  likes_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
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
CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User quest progress policies
CREATE POLICY "Users can read own quest progress"
  ON user_quest_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own quest progress"
  ON user_quest_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

-- Create indexes for better performance
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