# HomeScool Academy - Development Handoff Document

**Date:** January 29, 2026  
**Project:** HomeScool Academy  
**Status:** MVP Ready for Development  
**Timeline:** 2-3 weeks to beta launch

---

## Project Overview

HomeScool Academy is an AI-powered creative education platform featuring 15 unique AI teachers, project-based learning, and a gamified path to graduation. Students (ages 4-20) work on custom projects, earn credits, and interact with specialized AI teachers powered by Grok API.

**Tech Stack:**
- Frontend: Next.js 14 (App Router), React, Tailwind CSS
- Backend: Supabase (PostgreSQL, Auth)
- AI: Grok API via custom SDK
- State: Zustand
- Deployment: Vercel

**Pricing:** $100/month family plan (unlimited students), scholarships available

---

## Project Structure

```
homescool-academy/
├── app/                   # Next.js pages
│   ├── (auth)/           # Login/signup
│   ├── academy/          # Main hall
│   ├── classroom/        # Teacher classrooms
│   ├── projects/         # Student projects
│   ├── gallery/          # Show & Tell
│   └── profile/          # Student profile
├── sdk/                  # HomeScool SDK
│   ├── core/            # Jess Light foundation
│   ├── personas/        # 15 teacher definitions
│   ├── agents/          # Teacher agent class
│   └── academy/         # Orchestrator
├── components/          # React components
├── lib/                 # Utilities, Supabase client
├── stores/              # Zustand state management
├── hooks/               # Custom React hooks
├── database/            # Supabase schema
└── docs/                # Complete specifications
```

---

## Phase 1: Critical (Launch Blockers) - Week 1

### 1.1 Supabase Setup ⚠️ PRIORITY

**Task:** Initialize Supabase project and run database migration

**Steps:**
1. Create new Supabase project at https://supabase.com
2. Copy project URL and anon key to `.env.local`
3. Open Supabase SQL Editor
4. Run entire contents of `database/supabase-schema.sql`
5. Verify all tables created (19 tables total)
6. Enable Row Level Security policies
7. Test auth (create test user)

**Acceptance Criteria:**
- [ ] All 19 tables exist in Supabase
- [ ] RLS policies active
- [ ] Can create user account
- [ ] Can sign in/out
- [ ] User row appears in `users` table

**Files:** `database/supabase-schema.sql`

---

### 1.2 Grok API Integration Testing

**Task:** Verify all 15 teachers respond correctly with proper personality

**Steps:**
1. Add Grok API key to `.env.local` as `NEXT_PUBLIC_GROK_API_KEY`
2. Create test student account
3. Chat with each of the 15 teachers
4. Verify they stay in character
5. Test cross-referrals (Coach Nelson → Author's Guild)
6. Check credits are awarded when mentioned

**Test Scenarios:**
- Ask Coach Nelson: "How do I write better?"
  - Should reference Shakespeare, ask "How's life?", possibly refer to Author's Guild
- Ask Thad: "My video looks boring"
  - Should be humble, offer to show his approach, mention iteration
- Ask Dr. Crawford: "What's the meaning of life?"
  - Should ask "What do YOU think?", be Socratic, comfortable with mystery

**Acceptance Criteria:**
- [ ] All 15 teachers respond in character
- [ ] System prompts are working (check `docs/teacher-system-prompts.md`)
- [ ] Cross-referrals detected and logged
- [ ] Credits awarded when appropriate
- [ ] Response time < 5 seconds

**Files:** 
- `sdk/academy/homescool-academy.ts`
- `sdk/agents/teacher-agent.ts`
- `stores/academy-store.ts`
- `app/classroom/[teacherId]/page.tsx`

**Known Issues:**
- Cross-referral detection uses simple regex - may need improvement
- Credits detection also uses regex - consider structured responses

---

### 1.3 Credits System

**Task:** Implement complete credits flow (award, log, level up)

**Steps:**
1. Verify `credits_log` table trigger updates student credits
2. Test level progression:
   - 0-249 credits = Freshman
   - 250-499 = Sophomore
   - 500-749 = Junior
   - 750-999 = Senior
   - 1000+ = Graduation eligible
3. Add credits UI components
4. Show credit animations when awarded
5. Update profile page with accurate credit count

**Acceptance Criteria:**
- [ ] Credits awarded during teacher chat
- [ ] Credits_log table populated
- [ ] Student credits auto-update via trigger
- [ ] Level changes at thresholds
- [ ] UI shows credit animation/notification
- [ ] Profile page shows accurate total

**Files:**
- `database/supabase-schema.sql` (triggers)
- `stores/academy-store.ts`
- `app/profile/page.tsx`
- Create: `components/credit-animation.tsx`

---

### 1.4 Challenge System (Browse, Accept, Track)

**Task:** Build complete challenge workflow

**Steps:**
1. Seed `challenges` table with sample challenges for each teacher
2. Build challenge browsing UI (filter by teacher, difficulty)
3. Implement "Accept Challenge" flow
4. Create `student_challenges` record
5. Build challenge detail page showing:
   - Description
   - Progress tracker (milestones)
   - Notes editor
   - File upload
   - Submit button
6. Update `student_challenges.status` on completion
7. Award credits on completion

**Pages to Create:**
- `app/challenges/page.tsx` (Browse all)
- `app/challenges/[challengeId]/page.tsx` (Detail view)

**Components to Create:**
- `components/challenge-card.tsx`
- `components/challenge-progress.tsx`
- `components/challenge-submit-modal.tsx`

**Acceptance Criteria:**
- [ ] Can browse challenges by teacher
- [ ] Can filter small/large
- [ ] Accept challenge creates DB record
- [ ] Challenge detail shows progress
- [ ] Can add notes and upload files
- [ ] Submit marks complete and awards credits
- [ ] Completed challenges show in profile

**Database:**
```sql
-- Sample seed data
INSERT INTO challenges (teacher_id, title, description, difficulty, estimated_weeks, credits, skills_taught) VALUES
  ('nelson', 'Write Game Recap Like Shakespeare', '...', 'small', 2, 75, ARRAY['writing', 'sports']),
  ('thad', 'Create First YouTube Video', '...', 'small', 1, 50, ARRAY['video', 'editing']);
```

---

### 1.5 Error Handling

**Task:** Graceful error states throughout app

**Scenarios to Handle:**
1. Grok API fails (timeout, rate limit, error)
2. Supabase query fails
3. Student has no challenges
4. No teachers available (should never happen)
5. Network offline
6. Invalid teacher ID
7. Session expired

**Components to Create:**
- `components/error-boundary.tsx`
- `components/loading-state.tsx`
- `components/empty-state.tsx`

**Acceptance Criteria:**
- [ ] User-friendly error messages (no technical jargon)
- [ ] Retry buttons where appropriate
- [ ] Loading states for async operations
- [ ] Empty states with CTAs
- [ ] Network errors handled gracefully
- [ ] Session expiry redirects to login

---

### 1.6 Parent Dashboard

**Task:** Parents can view their student's progress

**Create:**
- `app/parent/dashboard/page.tsx`
- Show all students (if multiple)
- For each student:
  - Credits and level
  - Active challenges
  - Recent activity
  - Teacher connections
  - Weekly summary

**Acceptance Criteria:**
- [ ] Parent can view all their students
- [ ] See real-time progress
- [ ] View recent conversations (summary only)
- [ ] See credits earned this week
- [ ] Cannot impersonate student (read-only)

---

### 1.7 Basic Analytics

**Task:** Track key metrics for product validation

**Metrics to Track:**
- User signups (by day)
- Active students (7-day, 30-day)
- Teacher usage (which teachers are popular?)
- Challenge completion rate
- Average session length
- Drop-off points

**Implementation:**
- Use Supabase built-in analytics OR
- Add PostHog/Mixpanel (lightweight)
- Create admin dashboard at `/admin/analytics`

**Acceptance Criteria:**
- [ ] Can see signup trends
- [ ] Teacher popularity ranking
- [ ] Challenge completion funnel
- [ ] Session duration histogram

---

## Phase 2: Important (Early Features) - Week 2

### 2.1 Weekly Video Lessons

**Task:** Teachers upload weekly video lessons, students can watch and mark complete

**Schema:**
- `video_lessons` table (already exists)
- `video_progress` table (already exists)

**Steps:**
1. Create admin panel to upload videos
2. Store videos in Supabase Storage
3. Build video player component
4. Track watch progress (percentage watched)
5. Mark as complete when 80%+ watched
6. Award 10 credits for watching

**Pages:**
- `app/admin/videos/page.tsx` (upload)
- Update `app/classroom/[teacherId]/page.tsx` (show video)

**Components:**
- `components/video-player.tsx`
- `components/video-upload-form.tsx`

**Acceptance Criteria:**
- [ ] Admin can upload videos
- [ ] Videos stored in Supabase Storage
- [ ] Students can watch in classroom
- [ ] Progress tracked (% watched)
- [ ] Marked complete at 80%
- [ ] Credits awarded

---

### 2.2 Show & Tell Gallery

**Task:** Students share completed work, peers comment and react

**Steps:**
1. Build submission form (title, description, media upload)
2. Create gallery grid view (filter by teacher, featured)
3. Detail view with comments
4. Comment system with moderation
5. Reaction system (like, inspired)
6. Teacher can feature submissions
7. Award "inspiration credits" (5 credits when someone marks "inspired")

**Pages:**
- Already exists: `app/gallery/page.tsx` (update with real data)
- Create: `app/gallery/[submissionId]/page.tsx`

**Components:**
- `components/submission-form.tsx`
- `components/submission-card.tsx`
- `components/comment-list.tsx`
- `components/comment-form.tsx`

**Acceptance Criteria:**
- [ ] Students can upload work (images/videos)
- [ ] Gallery shows all submissions
- [ ] Can filter by teacher
- [ ] Featured section works
- [ ] Comments load and post
- [ ] Reactions work (like, inspired)
- [ ] Inspiration credits awarded
- [ ] Moderation: flag inappropriate

---

### 2.3 Weekly Check-ins

**Task:** Automated weekly teacher check-ins

**Steps:**
1. Create check-in reminder system (email/notification)
2. Build check-in modal/page
3. Teacher asks questions:
   - "What did you work on this week?"
   - "Where are you stuck?"
   - "What's next?"
4. Student responds (text)
5. Save to `weekly_checkins` table
6. Award 5 credits for completing
7. Parent gets summary email

**Implementation:**
- Use Supabase Edge Functions for scheduled reminders
- OR Vercel Cron Jobs

**Acceptance Criteria:**
- [ ] Reminder sent Sunday 10am (user timezone)
- [ ] Check-in UI appears
- [ ] Student can answer questions
- [ ] Saved to database
- [ ] 5 credits awarded
- [ ] Parent gets email summary

---

## Phase 3: Launch Essentials - Week 3

### 3.1 Stripe Integration

**Task:** $100/month subscription with scholarship option

**Steps:**
1. Create Stripe account
2. Install `@stripe/stripe-js`
3. Create checkout session
4. Handle webhooks (subscription created, canceled, updated)
5. Update `users.subscription_status`
6. Block access if subscription inactive
7. Build scholarship application form
8. Manual scholarship approval (admin panel)

**Pages:**
- `app/subscribe/page.tsx`
- `app/billing/page.tsx`
- `app/scholarship/page.tsx`

**Webhooks to Handle:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Acceptance Criteria:**
- [ ] User can subscribe via Stripe
- [ ] Subscription status tracked in DB
- [ ] Webhooks update DB correctly
- [ ] Access blocked if inactive
- [ ] Can cancel/manage subscription
- [ ] Scholarship form exists
- [ ] Admin can approve scholarships

---

### 3.2 Onboarding Flow

**Task:** Smooth first-time experience for new students

**Steps:**
1. After signup, redirect to onboarding
2. Step 1: Create student profile (name, age, interests)
3. Step 2: Meet the teachers (show intro videos when ready)
4. Step 3: Select 3 initial interests
5. Step 4: Teachers suggest first challenges
6. Step 5: Accept first challenge
7. Redirect to academy

**Pages:**
- `app/onboarding/page.tsx` (multi-step form)

**Components:**
- `components/onboarding-stepper.tsx`
- `components/teacher-intro-carousel.tsx`

**Acceptance Criteria:**
- [ ] New users see onboarding
- [ ] Can't skip (required)
- [ ] Student profile created
- [ ] First challenge accepted
- [ ] Smooth UX (progress indicator)
- [ ] Can revisit in settings

---

### 3.3 Deployment

**Task:** Deploy to production

**Steps:**
1. Create Vercel account
2. Connect GitHub repo
3. Set environment variables
4. Deploy to production
5. Test production build
6. Setup custom domain (if available)
7. Enable Vercel Analytics
8. Setup error monitoring (Sentry)

**Environment Variables Needed:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_GROK_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

**Acceptance Criteria:**
- [ ] App deployed to Vercel
- [ ] Environment variables set
- [ ] Production build works
- [ ] Analytics enabled
- [ ] Errors tracked
- [ ] Custom domain (optional)

---

## Testing Checklist

Before inviting real students, complete this checklist:

### Functional Testing
- [ ] Create 3 test student accounts (ages 8, 12, 16)
- [ ] Sign in/out works
- [ ] Chat with all 15 teachers
- [ ] Verify teacher personalities correct
- [ ] Accept a challenge
- [ ] Work on challenge (add notes, upload files)
- [ ] Complete challenge, verify credits awarded
- [ ] Submit to Show & Tell
- [ ] Comment on another submission
- [ ] React (like, inspired) to submission
- [ ] Check weekly check-in flow
- [ ] Watch a video lesson
- [ ] View profile (accurate credits/level)
- [ ] Parent views student progress
- [ ] Subscribe via Stripe (test mode)
- [ ] Cancel subscription

### Cross-Browser Testing
- [ ] Chrome (desktop)
- [ ] Safari (desktop)
- [ ] Firefox
- [ ] Chrome (mobile)
- [ ] Safari (iOS)
- [ ] Edge

### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (iPad)
- [ ] Mobile (iPhone)
- [ ] Mobile (Android)

### Performance
- [ ] Lighthouse score > 90
- [ ] Page load < 3 seconds
- [ ] Teacher response < 5 seconds
- [ ] Images optimized
- [ ] No console errors

### Security
- [ ] Environment variables not exposed
- [ ] API keys secure
- [ ] RLS policies working
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection safe (Supabase handles)

---

## Known Issues & Warnings

### 1. Grok API Rate Limits
- Current plan unknown
- May need to implement rate limiting
- Consider caching common responses

### 2. Cross-Referral Detection
- Uses regex pattern matching
- May miss some cross-referrals
- Consider improving with structured responses

### 3. Credits Detection
- Also uses regex
- Not 100% reliable
- Consider explicit credit award commands

### 4. Video Storage
- Supabase Storage has limits
- May need CDN for videos later
- Consider Cloudflare Stream or Mux

### 5. Real-time Features
- Weekly check-ins need cron job
- Consider Supabase Realtime for live features
- Email notifications need service (SendGrid, Resend)

### 6. Scalability
- Current setup handles ~100 students
- For 1000+, need:
  - Separate video CDN
  - Caching layer (Redis)
  - Load balancing
  - Database optimization

---

## File Upload Requirements

### Supported Formats
**Images:** JPG, PNG, GIF, WebP (max 10MB)
**Videos:** MP4, MOV, WebM (max 100MB)
**Documents:** PDF, DOCX, TXT (max 25MB)

### Storage Structure
```
supabase-storage/
├── student-work/
│   └── {studentId}/
│       └── {challengeId}/
│           └── {filename}
├── teacher-videos/
│   └── {teacherId}/
│       └── {videoId}.mp4
└── avatars/
    └── {userId}.jpg
```

---

## Database Seed Data

For testing, seed these tables:

### Sample Challenges
```sql
-- See database/supabase-schema.sql for full schema
-- Add ~30 challenges (2 small + 1 large per teacher)
```

### Test Users
```sql
-- Create via Supabase Auth UI
-- Parent: parent@test.com / password123
-- Students: Created via onboarding
```

---

## API Endpoints Needed

### Supabase Edge Functions
1. `weekly-checkin-reminder` - Sends check-in reminders
2. `scholarship-approval` - Handles scholarship emails
3. `parent-weekly-summary` - Sends weekly progress emails

### Vercel API Routes
1. `/api/stripe/checkout` - Create checkout session
2. `/api/stripe/webhook` - Handle Stripe webhooks
3. `/api/stripe/portal` - Customer portal

---

## Component Library

### To Build
- `components/ui/button.tsx` (variants)
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/modal.tsx`
- `components/ui/badge.tsx`
- `components/ui/progress.tsx`
- `components/ui/tabs.tsx`

Consider using shadcn/ui for faster development.

---

## Documentation Links

- **Complete Spec:** `docs/homescool-complete-spec.md`
- **Teacher Prompts:** `docs/teacher-system-prompts.md`
- **Wireframes:** `docs/frontend-wireframes.md`
- **Database Schema:** `database/supabase-schema.sql`

---

## Support & Questions

**Product Owner:** Jess
**Questions About:**
- Teacher personalities → Check with Jess
- Product decisions → Check with Jess
- Technical implementation → Use docs, try solutions, ask if stuck

**Expected Response Time:** 24 hours

---

## Success Metrics

**Phase 1 Complete When:**
- 3 test students can complete full user journey
- All 15 teachers responding correctly
- Credits system working end-to-end
- No critical bugs

**Phase 2 Complete When:**
- Video lessons viewable
- Show & Tell functional
- Weekly check-ins automated

**Phase 3 Complete When:**
- Payment processing works
- Onboarding smooth
- Deployed to production
- Ready for beta testers

**Beta Launch Ready When:**
- All above complete
- 5 real families tested successfully
- Parent feedback positive
- No data loss or critical errors

---

## Timeline Estimate

**Week 1:** Phase 1 (Critical)  
**Week 2:** Phase 2 (Important)  
**Week 3:** Phase 3 (Launch)  
**Week 4:** Testing & Polish

**Total:** 3-4 weeks to beta launch

---

## Emergency Contacts

**If Stuck:**
1. Check documentation first
2. Search Supabase docs
3. Check Next.js docs
4. Ask Jess (24hr response)

**If Production Down:**
1. Check Vercel status
2. Check Supabase status
3. Check error logs (Sentry)
4. Rollback if needed

---

## Final Notes

This is a **student-facing product**. Quality matters more than speed. Test thoroughly. Make it delightful.

The 15 AI teachers are the core magic - ensure they feel real, helpful, and stay in character.

Good luck! 🚀

---

**Document Version:** 1.0  
**Last Updated:** January 29, 2026  
**Next Review:** After Phase 1 Complete
