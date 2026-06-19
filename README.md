# RecipeHub

Full-stack Next.js TypeScript recipe sharing platform. The app uses Next.js App Router for pages and API routes, MongoDB/Mongoose for persistence, Better Auth for Google sign-in support, JWT HTTPOnly cookies for app sessions, and Stripe Checkout for payments.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- DaisyUI
- Framer Motion
- TanStack Query
- Axios
- React Hook Form
- Better Auth client
- MongoDB + Mongoose
- JWT HTTPOnly cookies
- Stripe Checkout
- Zod validation

## Routes

- `/`
- `/recipes`
- `/recipes/[id]`
- `/login`
- `/register`
- `/dashboard`
- `/dashboard/recipes`
- `/dashboard/add`
- `/dashboard/favorites`
- `/dashboard/purchases`
- `/dashboard/profile`
- `/admin`
- `/admin/users`
- `/admin/recipes`
- `/admin/reports`
- `/admin/transactions`
- `/payment-success`

## Features

- App Router folder structure with route groups
- Full-stack API routes under `src/app/api`
- Backend code organized in `src/server`
- Protected dashboard and admin routes
- Reload-safe authentication using the server cookie session
- Redirect to intended route after login
- Dark and light theme toggle
- Stripe checkout confirmation flow
- Better Auth Google bridge support
- Recipes CRUD, favorites, reports, admin moderation, purchases, and transactions
- Server-side pagination and MongoDB `$in` category filtering
- Demo seed data for local testing

## Environment

Copy `.env.example` to `.env.local`.

```env
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/recipehub
JWT_SECRET=replace-with-a-long-random-secret
JWT_COOKIE_NAME=recipehub_token
JWT_EXPIRES_IN=7d
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
PREMIUM_PRICE=999
```

For Google login, add this redirect URI in Google Cloud Console:

```txt
http://localhost:3000/api/auth/better/callback/google
```

For production, replace the domain with your deployed URL and set:

```env
NEXT_PUBLIC_APP_URL=https://your-live-site.vercel.app
BETTER_AUTH_URL=https://your-live-site.vercel.app
BETTER_AUTH_TRUSTED_ORIGINS=https://your-live-site.vercel.app
```

## Demo Accounts

- Admin: `admin@recipehub.dev` / `Admin123`
- User: `rafi@recipehub.dev` / `Recipe123`
- Premium chef: `chef@recipehub.dev` / `Recipe123`

## Run locally

1. Copy `.env.example` to `.env.local`.
2. Install dependencies with `npm install`.
3. Seed demo data with `npm run seed`.
4. Start the app with `npm run dev`.
5. Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```
