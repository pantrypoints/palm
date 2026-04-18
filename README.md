# Pantrypoints Palm 🌸

A palm reading web app built with SvelteKit 2.x, Svelte 5, Turso DB, and Drizzle ORM.

## Tech Stack

- **Frontend**: SvelteKit 2.x + Svelte 5 (runes)
- **Database**: Turso (libSQL) + Drizzle ORM
- **Auth**: Cookie-based sessions (HMAC-signed, no external deps)
- **Styling**: Custom CSS with pink theme, Varela Round font
- **Icons**: lucide-svelte

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
```
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
SESSION_SECRET=your-super-secret-session-key-min-32-chars
```

To get Turso credentials:
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create pantrypoints-palm

# Get URL
turso db show pantrypoints-palm --url

# Get token
turso db tokens create pantrypoints-palm
```

### 3. Push the database schema

```bash
npm run db:push
```

### 4. Run development server

```bash
npm run dev
```

## Database Schema

- **user** — Stores user accounts with palm photo URLs, personal details
- **questions** — Questions submitted during registration
- **answers** — Palm reading responses written by admin

## Admin Access

To make a user an admin, update the `kind` column in the `user` table to `'admin'`:

```sql
UPDATE user SET kind = 'admin' WHERE username = 'your_username';
```

Admin users see an **Admin** link in the nav, leading to `/admin` where they can:
- View all registered users and their palm photos
- Write palm reading responses to each question
- Delete responses

## Routes

| Route | Description |
|---|---|
| `/` | Landing page + registration form |
| `/login` | Sign in |
| `/logout` | Sign out (POST action) |
| `/profile` | User profile + Q&A view |
| `/admin` | Admin dashboard (admin only) |

## Build for production

```bash
npm run build
npm run preview
```
