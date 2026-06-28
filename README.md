# Demo Bank - KYC Verification Application

A production-quality Next.js application for KYC (Know Your Customer) submission and verification workflow. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase, and Shadcn UI.

**Disclaimer:** This is strictly an educational/demo project. It does not represent any real financial institution.

## Features

- **KYC Submission Form** - Mobile-first form with validation
- **Admin Authentication** - Secure admin panel with Supabase Auth
- **Admin Dashboard** - Statistics and KYC record management
- **KYC Records Table** - Search, sort, pagination, CSV export
- **Status Management** - Approve, reject, and update KYC statuses
- **Dark Mode Support** - Automatic theme detection
- **Responsive Design** - Mobile-first with sidebar navigation

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (Database + Auth)
- [Shadcn UI](https://ui.shadcn.com/) components
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [TanStack Table](https://tanstack.com/table)
- [Lucide Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/) (Toast notifications)

## Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

## Setup Instructions

### 1. Clone and Install

```bash
git clone <repo-url>
cd r_kyc
npm install
```

### 2. Configure Supabase

Create a Supabase project at https://supabase.com.

### 3. Set Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Database Migrations

Run the SQL migration in the Supabase SQL Editor:

```sql
-- Open supabase/migrations/00001_initial.sql and execute it in Supabase SQL Editor
```

### 5. Create Admin User

In Supabase Authentication panel, create a user with:
- Email: admin@demobank.com (or your preferred email)
- Password: (choose a secure password)

### 6. Run the Application

```bash
npm run dev
```

- KYC Form: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # KYC submission form
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── admin/
│       ├── login/page.tsx        # Admin login
│       └── dashboard/
│           ├── layout.tsx        # Dashboard layout with sidebar
│           ├── page.tsx          # Dashboard stats
│           ├── records/
│           │   ├── page.tsx      # KYC records table
│           │   └── [id]/page.tsx # Record details
│           └── settings/page.tsx # Settings page
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── kyc-form.tsx              # KYC form component
│   ├── success-card.tsx          # Success message card
│   └── admin/
│       ├── sidebar.tsx           # Admin sidebar
│       ├── stats-cards.tsx       # Dashboard stat cards
│       ├── records-table.tsx     # Records table with TanStack
│       ├── record-detail.tsx     # Record detail view
│       └── use-columns.tsx       # Table column definitions
├── lib/
│   ├── utils.ts                  # cn() utility
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   └── middleware.ts        # Auth middleware
│   └── actions/
│       ├── kyc.ts               # KYC submission action
│       └── admin.ts             # Admin actions
├── types/
│   └── index.ts                 # TypeScript types
└── middleware.ts                # Next.js middleware
```

## Database Schema

### kyc_submissions table

| Column          | Type      | Description                |
|-----------------|-----------|----------------------------|
| id              | UUID      | Primary key (auto)         |
| full_name       | TEXT      | Customer full name         |
| father_name     | TEXT      | Father's name              |
| mobile_number   | TEXT      | Mobile with +977 prefix    |
| password        | TEXT      | Account password           |
| transaction_pin | TEXT      | 4-digit transaction PIN    |
| status          | TEXT      | Pending, Approved, Rejected|
| created_at      | TIMESTAMPTZ| Auto-generated timestamp  |

### Row Level Security

- **Anonymous users:** INSERT only (submit KYC forms)
- **Authenticated users:** Full CRUD (admin operations)

## Security

- Anonymous users cannot read existing submissions
- Admin authentication required for dashboard access
- Server actions for privileged operations
- RLS policies enforced at database level
- Service Role Key never exposed to frontend
