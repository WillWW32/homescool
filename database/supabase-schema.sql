# HomeScool Academy - Complete Supabase Schema

## Database Tables

### **1. users (Parents/Guardians)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'active', -- active, paused, cancelled
  subscription_tier TEXT DEFAULT 'family', -- family plan ($100/month)
  scholarship_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **2. students**
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER,
  interests TEXT[], -- Array of initial interests
  credits INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Freshman', -- Freshman (0-250), Sophomore (250-500), Junior (500-750), Senior (750-1000)
  avatar_url TEXT,
  graduation_date TIMESTAMP, -- Set when they hit 1,000 credits
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_credits ON students(credits);
```

---

### **3. teachers**
```sql
CREATE TABLE teachers (
  id TEXT PRIMARY KEY, -- 'nelson', 'thad', 'tyra', etc.
  name TEXT NOT NULL,
  full_name TEXT,
  age INTEGER,
  subjects TEXT[],
  background TEXT,
  voice TEXT,
  special_skill TEXT,
  philosophy TEXT,
  catchphrases TEXT[],
  classroom_id TEXT, -- For visual identity reference
  class_pet JSONB, -- {name: 'Bard', type: 'dog', description: '...'}
  system_prompt TEXT, -- Full combined prompt (Jess Light + Persona)
  avatar_url TEXT,
  intro_video_url TEXT, -- HeyGen video (when created)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data for 15 teachers
INSERT INTO teachers (id, name, full_name, age, subjects, class_pet) VALUES
  ('nelson', 'Coach Nelson', 'Mr. Nelson', 55, ARRAY['Sports', 'Literacy'], 
   '{"name": "Bard", "type": "golden retriever", "description": "old dog, sleeps through Shakespeare"}'),
  ('thad', 'Thad', 'Thad', 22, ARRAY['Media Production', 'Video', 'Audio'],
   '{"name": "unnamed", "type": "cat", "description": "walks on keyboard during lessons"}'),
  ('tyra', 'Tyra', 'Tyra', 23, ARRAY['Health', 'Wellness', 'Fitness'],
   '{"name": "unnamed", "type": "rescue dog", "description": "does yoga poses"}'),
  ('marco', 'Chef Marco', 'Chef Marco', 38, ARRAY['Culinary Arts', 'Chemistry'],
   '{"name": "Nonno", "type": "cat", "description": "grumpy, judges food"}'),
  ('rivera', 'Ms. Rivera', 'Ms. Rivera', 29, ARRAY['Music', 'Math'],
   '{"name": null, "type": null, "description": null}'),
  ('kai', 'Professor Kai', 'Professor Kai', 34, ARRAY['Science', 'Sustainability'],
   '{"name": "The Council", "type": "beehive", "description": "observable through window"}'),
  ('hughes', 'Mrs. Hughes', 'Mrs. Hughes', 46, ARRAY['Art', 'Design'],
   '{"name": "unnamed", "type": "cat", "description": "tests furniture by napping"}'),
  ('murphy', 'Dr. Murphy', 'Dr. Murphy', 51, ARRAY['History', 'Storytelling'],
   '{"name": null, "type": null, "description": null}'),
  ('crawford', 'Dr. Crawford', 'Dr. Crawford', 58, ARRAY['Theology', 'Philosophy'],
   '{"name": "Persian name", "type": "tortoise", "description": "ancient, wise"}'),
  ('sage', 'Sage', 'Sage', 26, ARRAY['YouTube', 'Digital Influence'],
   '{"name": null, "type": null, "description": null}'),
  ('tom', 'Traction Tom', 'Traction Tom', 42, ARRAY['Marketing', 'Growth'],
   '{"name": null, "type": null, "description": null}'),
  ('elijah', 'Master Elijah', 'Master Elijah', 67, ARRAY['Trades', 'Craftsmanship'],
   '{"name": "unnamed", "type": "cat", "description": "tests furniture quality"}'),
  ('luna', 'Luna', 'Luna', 31, ARRAY['Art Therapy', 'Emotional Expression'],
   '{"name": "unnamed", "type": "rabbit", "description": "therapy animal students can hold"}'),
  ('authors', 'The Author''s Guild', 'The Author''s Guild', NULL, ARRAY['Writing', 'Publishing'],
   '{"name": null, "type": null, "description": "trio of writers"}'),
  ('boone', 'Mr. Boone', 'Mr. Boone', 39, ARRAY['Business', 'Finance', 'Coding'],
   '{"name": null, "type": null, "description": null}');
```

---

### **4. challenges (Project pools for each teacher)**
```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id TEXT REFERENCES teachers(id),
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT NOT NULL, -- 'small' or 'large'
  estimated_weeks INTEGER, -- 1-2 for small, 4-8 for large
  credits INTEGER NOT NULL, -- 50-100 for small, 200-300 for large
  skills_taught TEXT[], -- What students will learn
  requirements TEXT[], -- Prerequisites if any
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for querying by teacher and difficulty
CREATE INDEX idx_challenges_teacher ON challenges(teacher_id);
CREATE INDEX idx_challenges_difficulty ON challenges(difficulty);

-- Example challenges (seed data)
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
```

---

### **5. student_challenges (Accepted challenges)**
```sql
CREATE TABLE student_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id),
  status TEXT DEFAULT 'active', -- active, submitted, completed, abandoned
  progress_percentage INTEGER DEFAULT 0,
  notes TEXT, -- Student's working notes
  started_at TIMESTAMP DEFAULT NOW(),
  submitted_at TIMESTAMP,
  completed_at TIMESTAMP,
  credits_earned INTEGER DEFAULT 0,
  teacher_feedback TEXT
);

CREATE INDEX idx_student_challenges_student ON student_challenges(student_id);
CREATE INDEX idx_student_challenges_status ON student_challenges(status);
```

---

### **6. projects (Larger student work)**
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  teachers TEXT[], -- Array of teacher IDs involved (cross-disciplinary)
  status TEXT DEFAULT 'active', -- active, submitted, completed
  credits_earned INTEGER DEFAULT 0,
  milestones JSONB[], -- [{name: 'Research', completed: true, credits: 25}, ...]
  media_urls TEXT[], -- Images, videos, files from project
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_projects_student ON projects(student_id);
CREATE INDEX idx_projects_status ON projects(status);
```

---

### **7. conversations**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id TEXT REFERENCES teachers(id),
  messages JSONB[] NOT NULL, -- [{role: 'student'|'teacher', content: '...', timestamp: '...', credits_awarded: 0}]
  context_type TEXT, -- 'lesson', 'checkin', 'project_help', 'challenge_support'
  related_challenge_id UUID REFERENCES student_challenges(id),
  related_project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_student ON conversations(student_id);
CREATE INDEX idx_conversations_teacher ON conversations(teacher_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);
```

---

### **8. shared_context (Cross-teacher awareness)**
```sql
CREATE TABLE shared_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  context_type TEXT NOT NULL, -- 'cross_refer', 'project_update', 'milestone', 'concern'
  from_teacher_id TEXT REFERENCES teachers(id),
  to_teacher_id TEXT REFERENCES teachers(id),
  data JSONB NOT NULL, -- Flexible JSON for different context types
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shared_context_student ON shared_context(student_id);
CREATE INDEX idx_shared_context_to_teacher ON shared_context(to_teacher_id);

-- Example: Coach Nelson refers student to Author's Guild
-- data: {
--   "reason": "narrative structure for sports writing",
--   "student_question": "How do I make my game recaps more engaging?",
--   "suggested_action": "Work on story arc and tension"
-- }
```

---

### **9. video_lessons**
```sql
CREATE TABLE video_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id TEXT REFERENCES teachers(id),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  skills_covered TEXT[],
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  week_number INTEGER, -- Which week this lesson was released
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_video_lessons_teacher ON video_lessons(teacher_id);
CREATE INDEX idx_video_lessons_published ON video_lessons(published_at DESC);
```

---

### **10. video_progress (Track which students watched which videos)**
```sql
CREATE TABLE video_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  video_lesson_id UUID REFERENCES video_lessons(id) ON DELETE CASCADE,
  watch_percentage INTEGER DEFAULT 0, -- 0-100
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, video_lesson_id)
);

CREATE INDEX idx_video_progress_student ON video_progress(student_id);
```

---

### **11. weekly_checkins**
```sql
CREATE TABLE weekly_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  teacher_id TEXT REFERENCES teachers(id),
  week_start_date DATE NOT NULL,
  questions_asked JSONB, -- [{q: "What did you work on?", a: "..."}, ...]
  progress_notes TEXT,
  next_steps TEXT,
  credits_awarded INTEGER DEFAULT 5, -- Standard 5 credits for showing up
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weekly_checkins_student ON weekly_checkins(student_id);
CREATE INDEX idx_weekly_checkins_week ON weekly_checkins(week_start_date DESC);
```

---

### **12. show_and_tell (Student gallery)**
```sql
CREATE TABLE show_and_tell (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  challenge_id UUID REFERENCES student_challenges(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL, -- "Here's what I made and why"
  media_urls TEXT[] NOT NULL, -- Images, videos, files
  classrooms TEXT[], -- Which teacher classrooms this appears in
  featured BOOLEAN DEFAULT false, -- Teachers can feature exceptional work
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_show_and_tell_student ON show_and_tell(student_id);
CREATE INDEX idx_show_and_tell_featured ON show_and_tell(featured, created_at DESC);
CREATE INDEX idx_show_and_tell_classrooms ON show_and_tell USING GIN (classrooms);
```

---

### **13. show_and_tell_comments**
```sql
CREATE TABLE show_and_tell_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_and_tell_id UUID REFERENCES show_and_tell(id) ON DELETE CASCADE,
  commenter_id UUID REFERENCES students(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  is_inspiring BOOLEAN DEFAULT false, -- Did this inspire the commenter?
  flagged BOOLEAN DEFAULT false, -- For moderation
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_show_and_tell ON show_and_tell_comments(show_and_tell_id);
CREATE INDEX idx_comments_flagged ON show_and_tell_comments(flagged);
```

---

### **14. show_and_tell_reactions**
```sql
CREATE TABLE show_and_tell_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  show_and_tell_id UUID REFERENCES show_and_tell(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- 'like', 'inspired', 'amazing', 'helpful'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(show_and_tell_id, student_id, reaction_type)
);

CREATE INDEX idx_reactions_show_and_tell ON show_and_tell_reactions(show_and_tell_id);
```

---

### **15. credits_log (Audit trail)**
```sql
CREATE TABLE credits_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'lesson_complete', 'project_milestone', 'weekly_checkin', 'challenge_complete', 'helped_peer', 'inspiration_bonus'
  teacher_id TEXT REFERENCES teachers(id),
  related_id UUID, -- ID of challenge, project, video, etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_credits_log_student ON credits_log(student_id);
CREATE INDEX idx_credits_log_created ON credits_log(created_at DESC);

-- Trigger to update student credits
CREATE OR REPLACE FUNCTION update_student_credits()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE students 
  SET credits = credits + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.student_id;
  
  -- Update level based on credits
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
```

---

### **16. badges**
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  requirement_type TEXT, -- 'credits', 'projects', 'streak', 'special'
  requirement_value INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed common badges
INSERT INTO badges (name, description, requirement_type, requirement_value) VALUES
  ('First Steps', 'Earned your first 50 credits', 'credits', 50),
  ('Committed Learner', '30-day streak', 'streak', 30),
  ('Renaissance Student', 'Completed projects with 3+ different teachers', 'projects', 3),
  ('Helpful Peer', 'Helped 10 other students', 'special', 10),
  ('Subject Master', 'Completed 10 challenges with one teacher', 'challenges', 10);
```

---

### **17. student_badges**
```sql
CREATE TABLE student_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, badge_id)
);

CREATE INDEX idx_student_badges_student ON student_badges(student_id);
```

---

### **18. streaks**
```sql
CREATE TABLE streaks (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **19. graduation_ceremonies**
```sql
CREATE TABLE graduation_ceremonies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  ceremony_date DATE NOT NULL,
  capstone_project_id UUID REFERENCES projects(id),
  portfolio_url TEXT, -- Generated portfolio website
  diploma_url TEXT, -- PDF diploma
  teacher_remarks JSONB, -- {teacher_id: "remark", ...}
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_graduation_student ON graduation_ceremonies(student_id);
CREATE INDEX idx_graduation_date ON graduation_ceremonies(ceremony_date DESC);
```

---

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_and_tell ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_and_tell_comments ENABLE ROW LEVEL SECURITY;

-- Students: Parents can see their own students
CREATE POLICY students_policy ON students
  FOR ALL USING (
    parent_id = auth.uid()
  );

-- Projects: Students can see their own projects, parents can see their students' projects
CREATE POLICY projects_policy ON projects
  FOR ALL USING (
    student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
  );

-- Show and Tell: Everyone can read, but only author can update/delete
CREATE POLICY show_and_tell_read ON show_and_tell
  FOR SELECT USING (true);

CREATE POLICY show_and_tell_write ON show_and_tell
  FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM students WHERE parent_id = auth.uid())
  );

-- Comments: Everyone can read, authenticated users can insert
CREATE POLICY comments_read ON show_and_tell_comments
  FOR SELECT USING (true);

CREATE POLICY comments_insert ON show_and_tell_comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

---

## Storage Buckets

```sql
-- Create storage buckets for media
INSERT INTO storage.buckets (id, name, public) VALUES
  ('student-work', 'student-work', true),
  ('teacher-videos', 'teacher-videos', true),
  ('avatars', 'avatars', true),
  ('diplomas', 'diplomas', false);

-- Storage policies
CREATE POLICY "Students can upload their work"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'student-work');

CREATE POLICY "Public can view student work"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'student-work');
```

---

## Database Functions (Helpers)

### Award Credits
```sql
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
```

### Get Student Dashboard
```sql
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
```

---

## Complete! This schema supports:

✅ 15 unique teachers with class pets
✅ Challenge pools (small + large projects)
✅ Weekly video lessons
✅ Student conversations with teachers
✅ Cross-teacher referrals and shared context
✅ Show & Tell gallery with comments and reactions
✅ Credits system with automatic calculation
✅ Weekly check-ins
✅ Badges and streaks
✅ Graduation tracking
✅ Row-level security for privacy
✅ Helper functions for common operations

Ready for frontend wireframes next!
