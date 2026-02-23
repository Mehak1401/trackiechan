# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based subscription management application built with Vite, TypeScript, shadcn/ui, and Supabase. It allows users to track recurring subscriptions, view payment schedules on a calendar, and receive reminders for upcoming payments.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Run tests (Vitest)
npm run test

# Run tests in watch mode
npm run test:watch
```

## Architecture

### Tech Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript (relaxed strictness - `noImplicitAny: false`, `strictNullChecks: false`)
- **Styling**: Tailwind CSS with dark theme (CSS variables in `src/index.css`)
- **UI Components**: shadcn/ui (49 components in `src/components/ui/`)
- **State Management**: TanStack Query (React Query) for server state
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router DOM
- **Testing**: Vitest with React Testing Library (jsdom environment)

### Key Directories

```
src/
├── components/       # React components
│   ├── ui/          # shadcn/ui components (auto-generated, don't edit directly)
│   └── *.tsx        # Feature components (Header, CalendarGrid, etc.)
├── pages/           # Route pages (Index, Auth, Subscriptions, NotFound)
├── hooks/           # Custom React hooks
│   ├── useAuth.ts   # Supabase authentication
│   ├── useSubscriptions.ts  # CRUD operations for subscriptions
│   └── useNotificationReminders.ts  # Payment reminders
├── lib/             # Utilities
│   ├── utils.ts     # cn() helper for Tailwind
│   ├── mockData.ts  # TypeScript types and brand color mappings
│   └── subscriptionUtils.ts  # Subscription calculation utilities
├── integrations/
│   └── supabase/    # Supabase client and auto-generated types
└── test/            # Test setup and utilities
```

### Data Flow

1. **Authentication**: Supabase Auth with persistent sessions. The `useAuth` hook manages auth state and provides login/logout methods.

2. **Subscriptions**: The `useSubscriptions` hook uses TanStack Query to fetch and cache subscription data from Supabase. It provides:
   - `subscriptions` - array of subscription objects
   - `addSubscription` - async function to create new subscription
   - `deleteSubscription` - async function to delete subscription

3. **Database Schema** (see `src/integrations/supabase/types.ts`):
   - `subscriptions` table with fields: `id`, `name`, `amount`, `currency`, `cycle`, `due_day`, `color`, `initial`, `autopay`, `payment_source`, `start_date`, `end_date`, `user_id`

### Important Patterns

- **Path Alias**: Use `@/` to import from `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- **Brand Colors**: The `KNOWN_BRANDS` map in `src/lib/mockData.ts` defines colors and initials for common services (Netflix, Spotify, etc.)
- **Dark Theme**: The app uses a dark theme by default with CSS variables defined in `src/index.css`
- **Type Safety**: Supabase types are auto-generated in `src/integrations/supabase/types.ts`. Use helper types `Tables`, `TablesInsert`, `TablesUpdate` for type-safe database operations.

### Environment Variables

Required for Supabase (should be in `.env`):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### shadcn/ui Components

This project uses shadcn/ui for UI components. Components are in `src/components/ui/` and should not be edited directly (they are auto-generated). To add new components, use the shadcn CLI.

### Testing

Tests use Vitest with jsdom environment. The setup file at `src/test/setup.ts` includes:
- `@testing-library/jest-dom` matchers
- `matchMedia` mock for responsive component testing

Test files should follow the pattern: `src/**/*.{test,spec}.{ts,tsx}`
