# GST Invoices

A modern GST invoice management system built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- ⚡ **Next.js 15** with App Router
- 🔷 **TypeScript** for type safety
- 🎨 **Tailwind CSS** for styling
- 🧩 **shadcn/ui** for beautiful components
- 🎭 **Framer Motion** for animations
- 🌙 **Dark/Light theme** support
- 🔐 **Supabase** for authentication and database
- 💰 **Razorpay** integration for payments
- 📊 **GST compliance** with HSN/SAC codes
- 🛡️ **Row Level Security** for data isolation
- 📏 **ESLint** for code linting
- 💅 **Prettier** for code formatting
- 🐕 **Husky** for git hooks
- 🔍 **Type checking** with TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Razorpay account (optional)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gst-invoices
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay (optional)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Set up the database:

```bash
# Apply database migrations
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/001_initial_schema.sql
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/002_rls_policies.sql
psql -h your-db-host -U postgres -d your-db-name -f supabase/migrations/003_views_and_functions.sql

# Apply RLS policies
psql -h your-db-host -U postgres -d your-db-name -f supabase/policies/000_apply_all_policies.sql
```

5. Seed the database with demo data:

```bash
npm run db:seed
```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database

- `npm run db:seed` - Seed database with demo data
- `npm run db:seed:dev` - Seed database for development
- `npm run db:clear` - Clear demo data
- `npm run db:reset` - Clear and re-seed demo data

## Database Seeding

The application includes a comprehensive seeding system for quick testing and development.

### Demo Data Created

- **Demo User**: `demo@gstinvoices.com`
- **Business**: Tech Solutions Pvt Ltd
- **Customers**: 4 customers (individual and business)
- **Items**: 5 products/services with GST compliance
- **Invoices**: 4 sample invoices with different statuses
- **Payments**: 2 payment records
- **Subscription**: Professional Plan

### Seeding Commands

```bash
# Seed with demo data
npm run db:seed

# Clear demo data
npm run db:clear

# Reset (clear + seed)
npm run db:reset
```

For detailed information, see [scripts/README.md](scripts/README.md).

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout with providers
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── auth-buttons.tsx
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   └── theme-provider.tsx
├── lib/               # Utility functions
│   ├── supabase/      # Supabase clients
│   ├── auth.ts        # Authentication utilities
│   ├── config.ts      # Configuration
│   ├── database.ts    # Database operations
│   ├── razorpay.ts    # Razorpay integration
│   └── utils.ts       # Tailwind class utilities
├── providers/         # React context providers
│   └── auth-provider.tsx
├── hooks/             # Custom React hooks
└── types/             # TypeScript type definitions
    └── db.ts          # Database types

supabase/
├── migrations/        # Database migrations
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   ├── 003_views_and_functions.sql
│   └── 004_sample_data.sql
├── policies/          # Row Level Security policies
│   ├── 000_apply_all_policies.sql
│   ├── 001_enable_rls.sql
│   └── ... (individual policy files)
└── README.md          # Database documentation

scripts/
├── seed.ts            # Database seeding script
├── clear-demo-data.ts # Clear demo data script
└── README.md          # Seeding documentation
```

## Database Schema

The application uses a comprehensive database schema with:

### Core Tables

- **users** - User profiles and authentication
- **subscriptions** - Subscription management
- **businesses** - Business information and GST details
- **customers** - Customer data with billing/shipping
- **items** - Product/service catalog with HSN/SAC codes
- **invoices** - Invoice records with calculated totals
- **invoice_items** - Line items with detailed tax calculations
- **payments** - Payment tracking with multiple methods

### Security Features

- **Row Level Security (RLS)** on all tables
- **Complete data isolation** between users
- **Guest user protection** (no database access)
- **Automatic security** for views and functions

### GST Compliance

- **HSN/SAC codes** for all items
- **CGST/SGST/IGST** calculations
- **Cess support** for specific items
- **Proper tax rate** configurations

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Theme**: next-themes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky

## Development

The project uses:

- **Absolute imports** with `@/*` alias
- **Pre-commit hooks** for linting and formatting
- **Type checking** on build
- **Modern CSS** with Tailwind utilities
- **Type-safe database** operations
- **Environment validation** with Zod
- **Comprehensive testing** with demo data

## Authentication

The application uses Supabase Auth with:

- **Email/password** authentication
- **Row Level Security** for data isolation
- **Session management** with React context
- **Protected routes** with server-side validation
- **User profile** management

## Payment Integration

Razorpay integration includes:

- **Multiple payment methods** (UPI, cards, net banking)
- **Payment tracking** and status updates
- **Invoice generation** with payment links
- **Subscription management** for recurring payments

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

ISC
