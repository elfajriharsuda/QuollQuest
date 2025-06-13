/*
  # Fix ambiguous column reference in update_login_streak function

  1. Function Updates
    - Drop and recreate the `update_login_streak` function
    - Properly qualify all column references with table aliases
    - Resolve ambiguity between function parameters and table columns

  2. Changes Made
    - Use table aliases (u for users table) to qualify all column references
    - Ensure longest_streak, login_streak, and other columns are properly referenced
    - Maintain the same function logic while fixing the ambiguity issue
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS update_login_streak(uuid);

-- Recreate the function with proper column qualification
CREATE OR REPLACE FUNCTION update_login_streak(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    last_login date;
    current_streak integer;
    longest_streak_val integer;
BEGIN
    -- Get the user's last login date and current streaks
    SELECT u.last_login_date, u.login_streak, u.longest_streak
    INTO last_login, current_streak, longest_streak_val
    FROM users u
    WHERE u.id = p_user_id;
    
    -- If no previous login or login was yesterday, increment streak
    IF last_login IS NULL OR last_login = CURRENT_DATE - INTERVAL '1 day' THEN
        current_streak := COALESCE(current_streak, 0) + 1;
        
        -- Update longest streak if current streak is higher
        IF current_streak > COALESCE(longest_streak_val, 0) THEN
            longest_streak_val := current_streak;
        END IF;
        
        -- Update the user record
        UPDATE users u
        SET 
            last_login_date = CURRENT_DATE,
            login_streak = current_streak,
            longest_streak = longest_streak_val,
            total_logins = COALESCE(u.total_logins, 0) + 1,
            updated_at = NOW()
        WHERE u.id = p_user_id;
        
        -- Insert login history record
        INSERT INTO user_login_history (user_id, login_date)
        VALUES (p_user_id, CURRENT_DATE)
        ON CONFLICT (user_id, login_date) DO NOTHING;
        
    -- If login was not consecutive, reset streak to 1
    ELSIF last_login < CURRENT_DATE - INTERVAL '1 day' THEN
        -- Update the user record with reset streak
        UPDATE users u
        SET 
            last_login_date = CURRENT_DATE,
            login_streak = 1,
            total_logins = COALESCE(u.total_logins, 0) + 1,
            updated_at = NOW()
        WHERE u.id = p_user_id;
        
        -- Insert login history record
        INSERT INTO user_login_history (user_id, login_date)
        VALUES (p_user_id, CURRENT_DATE)
        ON CONFLICT (user_id, login_date) DO NOTHING;
        
    -- If already logged in today, just update total_logins
    ELSIF last_login = CURRENT_DATE THEN
        -- User already logged in today, no streak update needed
        -- Just ensure total_logins is accurate
        UPDATE users u
        SET 
            total_logins = COALESCE(u.total_logins, 0),
            updated_at = NOW()
        WHERE u.id = p_user_id;
    END IF;
END;
$$;