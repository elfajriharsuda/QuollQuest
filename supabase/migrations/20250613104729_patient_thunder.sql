/*
  # Add day streak tracking and leaderboard features

  1. Changes to users table
    - Add `last_login_date` (date) to track login dates
    - Add `login_streak` (integer, default 0) to track consecutive login days
    - Add `longest_streak` (integer, default 0) to track best streak
    - Add `total_logins` (integer, default 0) to track total login count

  2. New Tables
    - `user_login_history` - Track daily login history
    - `leaderboard_cache` - Cache leaderboard data for performance

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies

  4. Functions
    - Function to update login streak
    - Function to refresh leaderboard cache
*/

-- Add new columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_login_date'
  ) THEN
    ALTER TABLE users ADD COLUMN last_login_date date;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'login_streak'
  ) THEN
    ALTER TABLE users ADD COLUMN login_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'longest_streak'
  ) THEN
    ALTER TABLE users ADD COLUMN longest_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_logins'
  ) THEN
    ALTER TABLE users ADD COLUMN total_logins integer DEFAULT 0;
  END IF;
END $$;

-- Create user_login_history table
CREATE TABLE IF NOT EXISTS user_login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  login_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, login_date)
);

-- Create leaderboard_cache table
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  username text NOT NULL,
  avatar_url text,
  level integer DEFAULT 1,
  exp integer DEFAULT 0,
  login_streak integer DEFAULT 0,
  completed_quests integer DEFAULT 0,
  total_score integer DEFAULT 0,
  rank_position integer,
  category text NOT NULL, -- 'exp', 'streak', 'quests', 'overall'
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

-- Policies for user_login_history
CREATE POLICY "Users can read own login history"
  ON user_login_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login history"
  ON user_login_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for leaderboard_cache
CREATE POLICY "Public can read leaderboard"
  ON leaderboard_cache
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Service can manage leaderboard"
  ON leaderboard_cache
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update login streak
CREATE OR REPLACE FUNCTION update_login_streak(user_uuid uuid)
RETURNS void AS $$
DECLARE
  today_date date := CURRENT_DATE;
  last_login date;
  current_streak integer := 0;
  longest_streak integer := 0;
  total_logins integer := 0;
BEGIN
  -- Get current user data
  SELECT last_login_date, login_streak, longest_streak, total_logins
  INTO last_login, current_streak, longest_streak, total_logins
  FROM users
  WHERE id = user_uuid;

  -- Check if user already logged in today
  IF EXISTS (
    SELECT 1 FROM user_login_history 
    WHERE user_id = user_uuid AND login_date = today_date
  ) THEN
    RETURN; -- Already logged in today
  END IF;

  -- Insert today's login
  INSERT INTO user_login_history (user_id, login_date)
  VALUES (user_uuid, today_date)
  ON CONFLICT (user_id, login_date) DO NOTHING;

  -- Calculate new streak
  IF last_login IS NULL THEN
    -- First login ever
    current_streak := 1;
  ELSIF last_login = today_date - INTERVAL '1 day' THEN
    -- Consecutive day
    current_streak := current_streak + 1;
  ELSIF last_login = today_date THEN
    -- Same day (shouldn't happen due to check above)
    RETURN;
  ELSE
    -- Streak broken
    current_streak := 1;
  END IF;

  -- Update longest streak if needed
  IF current_streak > longest_streak THEN
    longest_streak := current_streak;
  END IF;

  -- Increment total logins
  total_logins := total_logins + 1;

  -- Update user record
  UPDATE users
  SET 
    last_login_date = today_date,
    login_streak = current_streak,
    longest_streak = longest_streak,
    total_logins = total_logins,
    updated_at = now()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh leaderboard cache
CREATE OR REPLACE FUNCTION refresh_leaderboard_cache()
RETURNS void AS $$
BEGIN
  -- Clear existing cache
  DELETE FROM leaderboard_cache;

  -- EXP Leaderboard
  INSERT INTO leaderboard_cache (user_id, username, avatar_url, level, exp, login_streak, completed_quests, total_score, rank_position, category)
  SELECT 
    u.id,
    u.username,
    u.avatar_url,
    u.level,
    u.exp,
    u.login_streak,
    COALESCE(quest_stats.completed_count, 0),
    COALESCE(quest_stats.total_score, 0),
    ROW_NUMBER() OVER (ORDER BY u.exp DESC, u.level DESC),
    'exp'
  FROM users u
  LEFT JOIN (
    SELECT 
      uqp.user_id,
      COUNT(*) FILTER (WHERE uqp.status = 'completed') as completed_count,
      SUM(uqp.score) FILTER (WHERE uqp.status = 'completed') as total_score
    FROM user_quest_progress uqp
    GROUP BY uqp.user_id
  ) quest_stats ON u.id = quest_stats.user_id
  ORDER BY u.exp DESC, u.level DESC
  LIMIT 100;

  -- Streak Leaderboard
  INSERT INTO leaderboard_cache (user_id, username, avatar_url, level, exp, login_streak, completed_quests, total_score, rank_position, category)
  SELECT 
    u.id,
    u.username,
    u.avatar_url,
    u.level,
    u.exp,
    u.login_streak,
    COALESCE(quest_stats.completed_count, 0),
    COALESCE(quest_stats.total_score, 0),
    ROW_NUMBER() OVER (ORDER BY u.login_streak DESC, u.longest_streak DESC),
    'streak'
  FROM users u
  LEFT JOIN (
    SELECT 
      uqp.user_id,
      COUNT(*) FILTER (WHERE uqp.status = 'completed') as completed_count,
      SUM(uqp.score) FILTER (WHERE uqp.status = 'completed') as total_score
    FROM user_quest_progress uqp
    GROUP BY uqp.user_id
  ) quest_stats ON u.id = quest_stats.user_id
  ORDER BY u.login_streak DESC, u.longest_streak DESC
  LIMIT 100;

  -- Quests Leaderboard
  INSERT INTO leaderboard_cache (user_id, username, avatar_url, level, exp, login_streak, completed_quests, total_score, rank_position, category)
  SELECT 
    u.id,
    u.username,
    u.avatar_url,
    u.level,
    u.exp,
    u.login_streak,
    COALESCE(quest_stats.completed_count, 0),
    COALESCE(quest_stats.total_score, 0),
    ROW_NUMBER() OVER (ORDER BY COALESCE(quest_stats.completed_count, 0) DESC, COALESCE(quest_stats.total_score, 0) DESC),
    'quests'
  FROM users u
  LEFT JOIN (
    SELECT 
      uqp.user_id,
      COUNT(*) FILTER (WHERE uqp.status = 'completed') as completed_count,
      SUM(uqp.score) FILTER (WHERE uqp.status = 'completed') as total_score
    FROM user_quest_progress uqp
    GROUP BY uqp.user_id
  ) quest_stats ON u.id = quest_stats.user_id
  ORDER BY COALESCE(quest_stats.completed_count, 0) DESC, COALESCE(quest_stats.total_score, 0) DESC
  LIMIT 100;

  -- Overall Leaderboard (weighted combination)
  INSERT INTO leaderboard_cache (user_id, username, avatar_url, level, exp, login_streak, completed_quests, total_score, rank_position, category)
  SELECT 
    u.id,
    u.username,
    u.avatar_url,
    u.level,
    u.exp,
    u.login_streak,
    COALESCE(quest_stats.completed_count, 0),
    COALESCE(quest_stats.total_score, 0),
    ROW_NUMBER() OVER (ORDER BY 
      (u.exp * 0.4 + 
       u.login_streak * 100 * 0.3 + 
       COALESCE(quest_stats.completed_count, 0) * 50 * 0.3) DESC
    ),
    'overall'
  FROM users u
  LEFT JOIN (
    SELECT 
      uqp.user_id,
      COUNT(*) FILTER (WHERE uqp.status = 'completed') as completed_count,
      SUM(uqp.score) FILTER (WHERE uqp.status = 'completed') as total_score
    FROM user_quest_progress uqp
    GROUP BY uqp.user_id
  ) quest_stats ON u.id = quest_stats.user_id
  ORDER BY 
    (u.exp * 0.4 + 
     u.login_streak * 100 * 0.3 + 
     COALESCE(quest_stats.completed_count, 0) * 50 * 0.3) DESC
  LIMIT 100;

  -- Update timestamp
  UPDATE leaderboard_cache SET updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS user_login_history_user_id_idx ON user_login_history(user_id);
CREATE INDEX IF NOT EXISTS user_login_history_date_idx ON user_login_history(login_date);
CREATE INDEX IF NOT EXISTS users_login_streak_idx ON users(login_streak);
CREATE INDEX IF NOT EXISTS users_last_login_idx ON users(last_login_date);
CREATE INDEX IF NOT EXISTS leaderboard_cache_category_idx ON leaderboard_cache(category);
CREATE INDEX IF NOT EXISTS leaderboard_cache_rank_idx ON leaderboard_cache(rank_position);