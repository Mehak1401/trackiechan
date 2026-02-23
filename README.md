# TrackieChan

A subscription management application to track and visualize your recurring subscriptions.

## Features

- Track recurring subscriptions (monthly/yearly)
- Calendar view for payment schedules
- Dark-themed UI
- Google OAuth authentication via Supabase
- Real-time data sync

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Auth + Database)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```
