# HomeScool Academy

**World-class creative arts education, AI-powered, personalized, freedom-based learning.**

---

## Vision

Hogwarts-style Creative Academy for K-12 students (ages 4-20) featuring 15 unique AI teachers, project-based learning, and a gamified path to graduation.

**Pricing:** $100/month flat family rate (unlimited students), scholarships available

---

## Project Structure

```
homescool-academy/
├── docs/                   # Complete documentation
│   ├── homescool-complete-spec.md
│   ├── teacher-system-prompts.md
│   └── frontend-wireframes.md
├── database/              # Supabase schema
│   └── supabase-schema.sql
├── sdk/                   # HomeScool SDK (Jess Light + 15 Teachers)
│   ├── core/
│   ├── personas/
│   ├── agents/
│   └── academy/
├── app/                   # Next.js 14 web app
├── components/            # React components
├── lib/                   # Utilities
└── README.md
```

---

## Features

### 🎓 **15 Unique AI Teachers**
Each with distinct personality, expertise, class pet, and teaching style:
- Coach Nelson (Sports & Literacy)
- Thad (Media Production)
- Tyra (Health & Wellness)
- Chef Marco (Culinary Arts & Chemistry)
- Ms. Rivera (Music & Math)
- Professor Kai (Science & Sustainability)
- Mrs. Hughes (Art & Design)
- Dr. Murphy (History & Storytelling)
- Dr. Crawford (Theology & Philosophy)
- Sage (YouTube & Digital Influence)
- Traction Tom (Marketing & Growth)
- Master Elijah (Trades & Craftsmanship)
- Luna (Art Therapy)
- The Author's Guild (Writing & Publishing)
- Mr. Boone (Business, Finance & Coding)

### 📚 **Learning Model**
- **Freedom-based** (not traditional school structure)
- **Micro-lessons** (5-15 min) → Teacher chat → Apply to projects
- **Weekly check-ins** for progress
- **Challenge-based** (not tasks)
- **Show & Tell** community gallery
- **1,000 credits to graduation**

### 🎮 **Gamification**
- Credits system
- Badges & achievements
- Streak tracking
- Levels (Freshman → Sophomore → Junior → Senior)
- June graduation ceremony

### 🤝 **Community**
- Show & Tell gallery
- Comment & react to peer work
- Cross-teacher referrals
- Peer collaboration

---

## Tech Stack

**Frontend:** React Native (mobile) + Next.js 14 (web)
**Backend:** Supabase (PostgreSQL)
**AI:** Grok API via HomeScool SDK
**Styling:** Tailwind CSS + NativeWind
**State:** Zustand

---

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Grok API key

### Installation

```bash
# Clone repo
git clone https://github.com/yourusername/homescool-academy.git
cd homescool-academy

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Add your Supabase URL, anon key, and Grok API key

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

---

## Documentation

See `/docs` folder for complete specifications:
- [Complete Spec](docs/homescool-complete-spec.md)
- [Teacher System Prompts](docs/teacher-system-prompts.md)
- [Frontend Wireframes](docs/frontend-wireframes.md)
- [Database Schema](database/supabase-schema.sql)

---

## Roadmap

- [ ] Build SDK (Jess Light core + 15 teachers)
- [ ] Setup Supabase project
- [ ] Build authentication
- [ ] Build Main Hall & Classrooms
- [ ] Build teacher chat system
- [ ] Build challenge acceptance & tracking
- [ ] Build Show & Tell gallery
- [ ] Create HeyGen intro videos (15 teachers)
- [ ] Beta testing
- [ ] Launch

---

## Contributing

This is a private project. Contact the owner for contribution guidelines.

---

## License

Proprietary - All Rights Reserved

---

**Created:** January 29, 2026
**By:** Jess
**Vision:** Best practical creative arts education for any kid in the US (then the world)
