# QuollQuest - AI-Powered Learning Platform

A gamified learning platform with AI-generated quizzes, fantasy adventures, and progressive skill development.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- A Supabase account and project

### 1. Clone and Install
```bash
npm install
```

### 2. Supabase Setup

#### Option A: Use the "Connect to Supabase" Button
1. Look for the "Connect to Supabase" button in the top-right corner of the application
2. Click it to automatically configure your Supabase connection
3. This will set up your environment variables and database

#### Option B: Manual Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API in your Supabase dashboard
3. Copy your Project URL and anon/public key
4. Update the `.env` file with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Run the database migrations:
```bash
# If you have Supabase CLI installed
supabase db push

# Or manually run the SQL files in supabase/migrations/ in your Supabase SQL editor
```

### 3. Start Development Server
```bash
npm run dev
```

## 🎮 Features

- **AI-Generated Quizzes**: Dynamic questions powered by AI for endless learning
- **Progressive Levels**: 6 difficulty levels per topic (Beginner to Advanced)
- **Gamification**: EXP, levels, streaks, and achievements
- **Community Features**: Share progress and compete on leaderboards
- **Fantasy Theme**: Immersive quest-based learning experience
- **Real-time Updates**: Live progress tracking and community feed

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **AI**: Custom AI service for question generation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
├── services/           # External service integrations
└── types/              # TypeScript type definitions

supabase/
└── migrations/         # Database schema migrations
```

## 🔧 Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 Deployment

The app is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add your environment variables in Vercel dashboard
3. Deploy!

## 📊 Database Schema

The application uses the following main tables:
- `users` - User profiles and progress
- `topics` - Learning subjects
- `quests` - Individual quest levels
- `quiz_attempts` - Quiz results
- `user_quest_progress` - Progress tracking
- `quoll_shouts` - Community posts
- `leaderboard_cache` - Performance optimization

## 🎯 Getting Started as a User

1. **Sign Up**: Create your adventurer profile
2. **Choose a Quest**: Select from popular topics or create custom ones
3. **Start Learning**: Take AI-generated quizzes with progressive difficulty
4. **Track Progress**: Monitor your EXP, level, and streaks
5. **Join Community**: Share achievements and compete with others

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Supabase Connection Issues
- Ensure your `.env` file has the correct Supabase credentials
- Check that your Supabase project is active
- Verify the database migrations have been applied
- Use the "Connect to Supabase" button for automatic setup

### Development Issues
- Clear browser cache and localStorage
- Restart the development server
- Check the browser console for detailed error messages

For more help, check the issues section or create a new issue.