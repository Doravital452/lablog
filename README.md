# LabLog - Experiment Tracking Application

A Next.js application for tracking and managing laboratory experiments with Supabase backend.

## Getting Started

### Prerequisites

1. **Node.js** (version 18 or higher)
2. **Supabase Project** - Create a free account at [supabase.com](https://supabase.com)

### Setup

1. Clone this repository:
```bash
git clone <your-repo-url>
cd LabLog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your Supabase credentials in `.env.local`:
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy your Project URL and Anon Key
   - Update the `.env.local` file with your values

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

Run the SQL schema in `supabase/schema.sql` in your Supabase project's SQL Editor to create the necessary tables.

## Features

- **Dashboard**: View all experiments in timeline or compare table views
- **Experiment Management**: Create, edit, and delete experiments
- **Rich Data**: Track concentration, pH, temperature, time, and results
- **Search & Filter**: Find experiments quickly
- **Responsive Design**: Works on desktop and mobile

## Technical Stack

- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
