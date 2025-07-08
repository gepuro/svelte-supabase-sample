# SvelteKit with Supabase

Everything you need to build a Svelte project with Supabase integration, powered by [`sv`](https://github.com/sveltejs/cli).

## 🚀 Features

- ✅ User Registration and Authentication
- ✅ Login/Logout functionality
- ✅ Password Reset
- ✅ Protected Dashboard
- ✅ Sample Data Management
- ✅ Modern UI with responsive design

## 📋 Authentication System

This project includes a complete authentication system with the following pages:

### Available Routes:
- `/` - Home page with navigation
- `/register` - User registration
- `/login` - User login
- `/forgot-password` - Password reset
- `/dashboard` - Protected user dashboard (requires authentication)

### Authentication Features:
- **User Registration**: Email/password with confirmation
- **Login**: Secure authentication with session management
- **Password Reset**: Email-based password recovery
- **Session Management**: Automatic logout and protected routes
- **Form Validation**: Client-side and server-side validation
- **Error Handling**: User-friendly Japanese error messages

## Supabase Setup

This project includes Supabase client integration. To get started:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Copy the project URL and anon key from your Supabase dashboard
3. Create a `.env.local` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The Supabase client is available throughout your app by importing from `$lib/supabase.js`.

## Sample Table

This project includes a `sample` table demonstration. The table includes:

- **id**: Primary key (auto-increment)
- **name**: Sample name (required)
- **description**: Optional description
- **created_at**: Timestamp of creation

### Database Setup

1. Run the migration to create the sample table in your Supabase SQL editor:

```sql
-- Create sample table
CREATE TABLE sample (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sample ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for everyone (development mode)
-- In production, you should restrict this to authenticated users or specific roles
CREATE POLICY "Allow all operations for everyone" ON sample
    FOR ALL USING (true);

-- Insert sample data
INSERT INTO sample (name, description) VALUES
    ('サンプル1', 'これは最初のサンプルデータです'),
    ('サンプル2', 'これは二番目のサンプルデータです'),
    ('サンプル3', NULL);
```

2. The sample table is already typed in `src/lib/database.types.ts`

### Features

- ✅ Create new sample records
- ✅ Read and display all samples
- ✅ Delete sample records
- ✅ Real-time updates
- ✅ Error handling
- ✅ TypeScript support

The main page (`/`) demonstrates CRUD operations with the sample table.

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## 🔧 Getting Started

### 1. Environment Setup

Copy the `.env.example` file to `.env` and configure your Supabase credentials:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase project details:

```env
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Authentication Setup

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Enable email confirmation if desired
3. Configure email templates (optional)
4. **重要**: Set up redirect URLs for email confirmation:
   - Go to Authentication > URL Configuration
   - Add `http://localhost:5173/auth/callback` to the "Redirect URLs" list
   - For production, add your production domain callback URL

### 3. Database Setup

Run the migrations to set up the sample table:

```sql
-- Create sample table (already included in migrations)
```

### 4. Start Development

```bash
npm install
npm run dev
```

Your app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### 5. Testing the Authentication

1. Visit the home page and click "新規登録" (Register)
2. Create a new account with your email
3. Check your email for confirmation (if enabled)
4. Login with your credentials
5. Access the protected dashboard

## 🎯 Usage Examples

### User Registration
```typescript
// In your component
import { supabase } from '$lib/supabase.js';

const { error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe'
    }
  }
});
```

### User Login
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Check Authentication Status
```typescript
import { supabase } from '$lib/supabase.js';

const { data: { user } } = await supabase.auth.getUser();
if (user) {
  // User is authenticated
}
```

-- 認証されたユーザーのみに全操作を許可
