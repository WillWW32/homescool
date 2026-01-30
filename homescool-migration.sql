-- HomeScool Academy - Database Setup Script
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'active',
  subscription_tier TEXT DEFAULT 'family',
  scholarship_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. STUDENTS TABLE
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  interests TEXT[],
  credits INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Freshman',
  avatar_url TEXT,
  graduation_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_credits ON students(credits);

-- 3. TEACHERS TABLE
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  subjects TEXT[],
  background TEXT,
  voice TEXT,
  special_skill TEXT,
  philosophy TEXT,
  catchphrases TEXT[],
  classroom_id TEXT,
  class_pet JSONB,
  system_prompt TEXT,
  avatar_url TEXT,
  intro_video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed teachers data
INSERT INTO teachers (id, name, full_name, age, subjects, class_pet) VALUES
  ('nelson', 'Coach Nelson', 'Mr. Nelson', 55, ARRAY['Sports', 'Literacy'],
   '{"name": "Bard", "type": "golden retriever", "description": "old dog, sleeps through Shakespeare"}'::jsonb),
  ('thad', 'Thad', 'Thad', 22, ARRAY['Media Production', 'Video', 'Audio'],
   '{"name": "unnamed", "type": "cat", "description": "walks on keyboard during lessons"}'::jsonb),
  ('tyra', 'Tyra', 'Tyra', 23, ARRAY['Health', 'Wellness', 'Fitness'],
   '{"name": "unnamed", "type": "rescue dog", "description": "does yoga poses"}'::jsonb),
  ('marco', 'Chef Marco', 'Chef Marco', 38, ARRAY['Culinary Arts', 'Chemistry'],
   '{"name": "Nonno", "type": "cat", "description": "grumpy, judges food"}'::jsonb),
  ('rivera', 'Ms. Rivera', 'Ms. Rivera', 29, ARRAY['Music', 'Math'],
   '{"name": null, "type": null, "description": null}'::jsonb),
  ('kai', 'Professor Kai', 'Professor Kai', 34, ARRAY['Science', 'Sustainability'],
   '{"name": "The Council", "type": "beehive", "description": "observable through window"}'::jsonb),
  ('hughes', 'Mrs. Hughes', 'Mrs. Hughes', 46, ARRAY['Art', 'Design'],
   '{"name": "unnamed", "type": "cat", "description": "tests furniture by napping"}'::jsonb),
  ('murphy', 'Dr. Murphy', 'Dr. Murphy', 51, ARRAY['History', 'Storytelling'],
   '{"name": null, "type": null, "description": null}'::jsonb),
  ('crawford', 'Dr. Crawford', 'Dr. Crawford', 58, ARRAY['Theology', 'Philosophy'],
   '{"name": "Persian name", "type": "tortoise", "description": "ancient, wise"}'::jsonb),
  ('sage', 'Sage', 'Sage', 26, ARRAY['YouTube', 'Digital Influence'],
   '{"name": null, "type": null, "description": null}'::jsonb),
  ('tom', 'Traction Tom', 'Traction Tom', 42, ARRAY['Marketing', 'Growth'],
   '{"name": null, "type": null, "description": null}'::jsonb),
  ('elijah', 'Master Elijah', 'Master Elijah', 67, ARRAY['Trades', 'Craftsmanship'],
   '{"name": "unnamed", "type": "cat", "description": "tests furniture quality"}'::jsonb),
  ('luna', 'Luna', 'Luna', 31, ARRAY['Art Therapy', 'Emotional Expression'],
   '{"name": "unnamed", "type": "rabbit", "description": "therapy animal students can hold"}'::jsonb),
  ('authors', 'The Author''s Guild', 'The Author''s Guild', NULL, ARRAY['Writing', 'Publishing'],
   '{"name": null, "type": null, "description": "trio of writers"}'::jsonb),
  ('boone', 'Mr. Boone', 'Mr. Boone', 39, ARRAY['Business', 'Finance', 'Coding'],
   '{"name": null, "type": null, "description": null}'::jsonb);

-- 4. CHALLENGES TABLE
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id TEXT REFERENCES teachers(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL,
  estimated_weeks INTEGER,
  credits INTEGER NOT NULL,
  skills_taught TEXT[],
  requirements TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_challenges_teacher ON challenges(teacher_id);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);

-- Seed challenges
INSERT INTO challenges (teacher_id, title, description, difficulty, estimated_weeks, credits, skills_taught) VALUES
  ('nelson', 'Write a Game Recap Like Shakespeare',
   'Take a recent sports game and write a recap using Shakespearean language and dramatic structure',
   'small', 2, 75, ARRAY['narrative writing', 'sports journalism', 'literary analysis']),
  ('thad', 'Create Your First YouTube Video',
   'Script, film, edit, and publish a 2-3 minute video about something you care about',
   'small', 1, 50, ARRAY['video production', 'editing', 'storytelling']),
  ('tyra', '30-Day Movement Challenge',
   'Move your body for 10 minutes every day for 30 days - your way, your pace',
   'small', 4, 100, ARRAY['consistency', 'body awareness', 'wellness']),
  ('marco', 'Master Pasta From Scratch',
   'Make fresh pasta (dough, shapes, sauce) three times until you can do it without a recipe',
   'small', 2, 75, ARRAY['cooking technique', 'chemistry', 'practice']),
  ('luna', 'Art Journal Your Emotions',
   'Create art from your feelings every day for 7 days - no rules, just expression',
   'small', 1, 50, ARRAY['emotional awareness', 'creative expression', 'self-care']);

-- 5. STUDENT CHALLENGES TABLE
CREATE TABLE student_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id),
  status TEXT DEFAULT 'active',
  progress_percentage INTEGER DEFAULT 0,
  notes TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  completed_at TIMESTAMP,
  credits_earned INTEGER DEFAULT 0,
  teacher_feedback TEXT
);

CREATE INDEX idx_student_challenges_student ON student_challenges(student_id);
CREATE INDEX idx_student_challenges_status ON student_challenges(status);

-- 6. PROJECTS TABLE
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  teachers TEXT[],
  status TEXT DEFAULT 'active',
  credits_earned INTEGER DEFAULT 0,
  milestones JSONB[],
  media_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_projects_status ON projects(status);

-- 7. CONVERSATIONS TABLE
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id TEXT REFERENCES teachers(id),
  messages JSONB[] NOT NULL,
  context_type TEXT,
  related_challenge_id UUID REFERENCES student_challenges(id),
  related_project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_student ON conversations(student_id);
CREATE INDEX idx_conversations_teacher ON conversations(teacher_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- 8. SHARED CONTEXT TABLE
CREATE TABLE shared_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL,
  from_teacher_id TEXT REFERENCES teachers(id),
  to_teacher_id TEXT REFERENCES teachers(id),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shared_context_student ON shared_context(student_id);
CREATE INDEX idx_shared_context_to_teacher ON shared_context(to_teacher_id);

-- 9. VIDEO LESSONS TABLE
CREATE TABLE video_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id TEXT REFERENCES teachers(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  skills_covered TEXT[],
  difficulty TEXT,
  week_number INTEGER,
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_video_lessons_teacher ON video_lessons(teacher_id);
CREATE INDEX idx_video_lessons_published ON video_lessons(published_at DESC);

-- 10. VIDEO PROGRESS TABLE
CREATE TABLE video_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  video_lesson_id UUID REFERENCES video_lessons(id) ON DELETE CASCADE,
  watch_percentage INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, video_lesson_id)
);

CREATE INDEX idx_video_progress_student ON video_progress(student_id);

-- 11. WEEKLY CHECKINS TABLE
CREATE TABLE weekly_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id TEXT REFERENCES teachers(id),
  week_start_date DATE NOT NULL,
  questions_asked JSONB,
  progress_notes TEXT,
  next_steps TEXT,
  credits_awarded INTEGER DEFAULT 5,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weekly_checkins_student ON weekly_checkins(student_id);
CREATE INDEX idx_weekly_checkins_week ON weekly_checkins(week_start_date DESC);

-- 12. SHOW AND TELL TABLE
CREATE TABLE show_and_tell (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  challenge_id UUID REFERENCES student_challenges(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  media_urls TEXT[] NOT NULL,
  classrooms TEXT[],
  featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_show_and_tell_student ON show_and_tell(student_id);
CREATE INDEX idx_show_and_tell_featured ON show_and_tell(featured, created_at DESC);
CREATE INDEX idx_show_and_tell_classrooms ON show_and_tell USING GIN (classrooms);

-- 13. SHOW AND TELL COMMENTS TABLE
CREATE TABLE show_and_tell_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_and_tell_id UUID REFERENCES show_and_tell(id) ON DELETE CASCADE,
  commenter_id UUID REFERENCES students(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_inspiring BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_show_and_tell ON show_and_tell_comments(show_and_tell_id);
CREATE INDEX idx_comments_flagged ON show_and_tell_comments(flagged);

-- 14. SHOW AND TELL REACTIONS TABLE
CREATE TABLE show_and_tell_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_and_tell_id UUID REFERENCES show_and_tell(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(show_and_tell_id, student_id, reaction_type)
);

CREATE INDEX idx_reactions_show_and_tell ON show_and_tell_reactions(show_and_tell_id);

-- 15. CREDITS LOG TABLE
CREATE TABLE credits_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  teacher_id TEXT REFERENCES teachers(id),
  related_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credits_log_student ON credits_log(student_id);
CREATE INDEX idx_credits_log_created ON credits_log(created_at DESC);

-- 16. BADGES TABLE
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed badges
INSERT INTO badges (name, description, requirement_type, requirement_value) VALUES
  ('First Steps', 'Earned your first 50 credits', 'credits', 50),
  ('Committed Learner', '30-day streak', 'streak', 30),
  ('Renaissance Student', 'Completed projects with 3+ different teachers', 'projects', 3),
  ('Helpful Peer', 'Helped 10 other students', 'special', 10),
  ('Subject Master', 'Completed 10 challenges with one teacher', 'challenges', 10);

-- 17. STUDENT BADGES TABLE
CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

CREATE INDEX idx_student_badges_student ON student_badges(student_id);

-- 18. STREAKS TABLE
CREATE TABLE streaks (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 19. GRADUATION CEREMONIES TABLE
CREATE TABLE graduation_ceremonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  ceremony_date DATE NOT NULL,
  capstone_project_id UUID REFERENCES projects(id),
  portfolio_url TEXT,
  diploma_url TEXT,
  teacher_remarks JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_graduation_student ON graduation_ceremonies(student_id);
CREATE INDEX idx_graduation_date ON graduation_ceremonies(ceremony_date DESC);

-- TRIGGER: Update student credits and level
CREATE OR REPLACE FUNCTION update_student_credits()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE students
  SET credits = credits + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.student_id;

  UPDATE students
  SET level = CASE
    WHEN credits >= 750 THEN 'Senior'
    WHEN credits >= 500 THEN 'Junior'
    WHEN credits >= 250 THEN 'Sophomore'
    ELSE 'Freshman'
  END
  WHERE id = NEW.student_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER credits_log_insert
AFTER INSERT ON credits_log
FOR EACH ROW
EXECUTE FUNCTION update_student_credits();

-- FUNCTION: Award credits
CREATE OR REPLACE FUNCTION award_credits(
  p_student_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_teacher_id TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO credits_log (student_id, amount, reason, teacher_id, related_id)
  VALUES (p_student_id, p_amount, p_reason, p_teacher_id, p_related_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Get student dashboard
CREATE OR REPLACE FUNCTION get_student_dashboard(p_student_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'student', (SELECT row_to_json(s) FROM students s WHERE id = p_student_id),
    'active_challenges', (
      SELECT json_agg(row_to_json(sc))
      FROM student_challenges sc
      WHERE sc.student_id = p_student_id AND sc.status = 'active'
    ),
    'recent_conversations', (
      SELECT json_agg(row_to_json(c))
      FROM (
        SELECT * FROM conversations
        WHERE student_id = p_student_id
        ORDER BY updated_at DESC
        LIMIT 5
      ) c
    ),
    'credits_this_week', (
      SELECT COALESCE(SUM(amount), 0)
      FROM credits_log
      WHERE student_id = p_student_id
        AND created_at >= date_trunc('week', NOW())
    ),
    'streak', (SELECT row_to_json(s) FROM streaks s WHERE student_id = p_student_id)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ROW LEVEL SECURITY
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_and_tell ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_and_tell_comments ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
CREATE POLICY students_policy ON students
  FOR ALL USING (
    parent_id = auth.uid()
  );

CREATE POLICY projects_policy ON projects
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
  );

CREATE POLICY show_and_tell_read ON show_and_tell
  FOR SELECT USING (true);

CREATE POLICY show_and_tell_write ON show_and_tell
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
  );

CREATE POLICY comments_read ON show_and_tell_comments
  FOR SELECT USING (true);

CREATE POLICY comments_insert ON show_and_tell_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
