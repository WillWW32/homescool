# HomeScool Academy - Quick Start

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Create a new Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Run the database migration:

```bash
# In Supabase SQL Editor, paste and run:
cat database/supabase-schema.sql
```

### 3. Environment Variables

```bash
cp .env.example .env.local

# Edit .env.local with your credentials:
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROK_API_KEY=your-grok-api-key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

---

## Using the SDK

### Initialize Academy

```typescript
import { HomeScoolAcademy } from '@/sdk';
import { supabase } from '@/lib/supabase';

const academy = new HomeScoolAcademy({
  apiKey: process.env.GROK_API_KEY!,
  supabase: supabase,
});
```

### Chat with a Teacher

```typescript
const studentContext = {
  id: 'student-uuid',
  name: 'Emma',
  age: 14,
  credits: 250,
  level: 'Freshman',
  activeProjects: ['Sports Blog'],
  activeChallenges: [],
  recentConversations: [],
};

// Route to best teacher
const result = await academy.routeQuestion(
  "How do I write a better game recap?",
  studentContext
);

console.log(result.teacher); // 'nelson'
console.log(result.response.message);
```

### Chat with Specific Teacher

```typescript
const result = await academy.routeQuestion(
  "Can you help me with my video editing?",
  studentContext,
  'thad' // Specify teacher ID
);
```

### Get a Teacher Directly

```typescript
const coachNelson = academy.getTeacher('nelson');
const response = await coachNelson.chatWithStudent(
  "How's life?",
  studentContext
);
```

---

## Project Structure

```
homescool-academy/
├── docs/              # Documentation
├── database/          # Supabase schema
├── sdk/               # HomeScool SDK
│   ├── core/          # Jess Light core
│   ├── personas/      # 15 teacher personas
│   ├── agents/        # Teacher agent class
│   └── academy/       # Main orchestrator
├── app/               # Next.js app (web)
├── components/        # React components
├── lib/               # Utilities
└── README.md
```

---

## Next Steps

1. Complete remaining 14 teacher personas in `sdk/personas/`
2. Build Next.js pages in `app/`
3. Create React components in `components/`
4. Add HeyGen video intro generation
5. Deploy to Vercel

---

## Documentation

See `docs/` for complete specs:
- [Complete Spec](docs/homescool-complete-spec.md)
- [Teacher Prompts](docs/teacher-system-prompts.md)
- [Wireframes](docs/frontend-wireframes.md)
