# Authentication Guide

This template includes a comprehensive authentication system powered by [better-auth](https://www.better-auth.com/), designed to be **opt-in** and easy to integrate when needed.

## Features

- **Email/Password Authentication**: Traditional username and password login
- **Google OAuth**: Single sign-on with Google accounts
- **Role-Based Access Control**: Built-in support for user roles (admin, user)
- **SQLite + Drizzle**: Seamlessly integrates with the existing database
- **Composable**: Works on both server (Astro) and client (React)
- **Protected Routes**: Easy-to-use utilities for protecting pages
- **Type-Safe**: Full TypeScript support with inferred types

## Quick Start

### 1. Enable Authentication

Uncomment the authentication environment variables in `astro.config.mjs`:

```javascript
// In astro.config.mjs, uncomment these lines:
AUTH_SECRET: envField.string({
  context: 'server',
  access: 'secret',
}),

GOOGLE_CLIENT_ID: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),

GOOGLE_CLIENT_SECRET: envField.string({
  context: 'server',
  access: 'secret',
  optional: true,
}),
```

### 2. Set Environment Variables

Create a `.env` file (or copy from `.env.example`):

```bash
# Required for authentication
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Other required variables
DATABASE_PATH="./db/data.db"
PUBLIC_APP_NAME="Your App Name"
PUBLIC_APP_URL="http://localhost:4321"
```

**Generate AUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

Generate and apply the authentication schema migrations:

```bash
# Generate migrations from the auth schema
pnpm db:generate

# Apply migrations to the database
pnpm db:migrate
```

This creates the following tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

### 4. (Optional) Configure Google OAuth

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:4321/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env` file

## Usage

### React Components (Client-Side)

#### Using Auth in React Components

```tsx
import { useSession, authClient } from "@/lib/auth/client";

function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

#### Sign In

```tsx
import { authClient } from "@/lib/auth/client";

// Email/Password
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123"
});

// Google OAuth
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/app/dashboard"
});
```

#### Sign Up

```tsx
import { authClient } from "@/lib/auth/client";

await authClient.signUp.email({
  name: "John Doe",
  email: "user@example.com",
  password: "password123"
});
```

#### Sign Out

```tsx
import { authClient } from "@/lib/auth/client";

await authClient.signOut();
```

#### Protected Routes (React)

```tsx
import { ProtectedRoute } from "@/components/app/auth";

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  );
}

// Require specific role
function AdminPanel() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Admin-only content</div>
    </ProtectedRoute>
  );
}

// Require one of multiple roles
function ModeratorPanel() {
  return (
    <ProtectedRoute requiredRoles={["admin", "moderator"]}>
      <div>Moderator content</div>
    </ProtectedRoute>
  );
}
```

### Astro Pages (Server-Side)

#### Get Current Session

```astro
---
import { getSession } from "@/lib/auth/utils";

const session = await getSession(Astro);
---

{session ? (
  <p>Welcome, {session.user.name}!</p>
) : (
  <p>Not logged in</p>
)}
```

#### Require Authentication

```astro
---
import { requireAuth } from "@/lib/auth/utils";

// Redirect to login if not authenticated
const session = await requireAuth(Astro);

// User is guaranteed to be authenticated here
const user = session.user;
---

<h1>Protected Page</h1>
<p>Welcome, {user.name}!</p>
```

#### Require Specific Role

```astro
---
import { requireRole } from "@/lib/auth/utils";

// Only admins can access this page
const session = await requireRole(Astro, "admin");
---

<h1>Admin Panel</h1>
```

#### Redirect if Already Authenticated

```astro
---
import { redirectIfAuthenticated } from "@/lib/auth/utils";

// Useful for login/signup pages
await redirectIfAuthenticated(Astro);
---

<h1>Login</h1>
<!-- Login form here -->
```

## Example Pages

The template includes ready-to-use example pages in `src/components/app/auth/pages/`:

- **LoginPage.tsx** - Login form with email/password and Google OAuth
- **SignupPage.tsx** - Registration form
- **DashboardPage.tsx** - Protected dashboard example
- **AdminPage.tsx** - Admin-only page example

### Integrating Example Pages

To use these pages in your app, you can either:

1. **Import them directly** (if you're using the default App.tsx structure):

```tsx
// In your App.tsx or routing setup
import { LoginPage, SignupPage, DashboardPage, AdminPage } from "@/components/app/auth";

// Use them directly or with a router
```

2. **Set up React Router** for more complex routing:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, SignupPage, DashboardPage, AdminPage } from "@/components/app/auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## User Roles

The system comes with two default roles:

- **user** (default) - Regular user
- **admin** - Administrator with elevated privileges

### Checking Roles

```tsx
import { hasRole, hasAnyRole } from "@/lib/auth/utils";

// Check for specific role
if (hasRole(session, "admin")) {
  // User is admin
}

// Check for any of multiple roles
if (hasAnyRole(session, ["admin", "moderator"])) {
  // User has admin or moderator role
}
```

### Adding More Roles

To add additional roles:

1. Update the role field in `src/lib/auth/schema.ts`:

```typescript
role: text("role").notNull().default("user"), // Add your role here
```

2. Use the new roles in your components:

```tsx
<ProtectedRoute requiredRole="moderator">
  <ModeratorPanel />
</ProtectedRoute>
```

## Database Schema

The authentication system uses the following tables:

### `user`
- `id` - Unique user ID
- `name` - User's full name
- `email` - Email address (unique)
- `emailVerified` - Whether email is verified
- `image` - Profile image URL
- `role` - User role (user, admin, etc.)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### `session`
- `id` - Session ID
- `userId` - Associated user ID
- `expiresAt` - Session expiration
- `ipAddress` - Client IP address
- `userAgent` - Client user agent
- `createdAt` - Session creation timestamp
- `updatedAt` - Last update timestamp

### `account`
- `id` - Account ID
- `userId` - Associated user ID
- `accountId` - Provider account ID
- `providerId` - OAuth provider (google, etc.)
- `accessToken` - OAuth access token
- `refreshToken` - OAuth refresh token
- `idToken` - OAuth ID token
- `expiresAt` - Token expiration
- `password` - Hashed password (for email/password auth)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### `verification`
- `id` - Verification ID
- `identifier` - Email or phone
- `value` - Verification token
- `expiresAt` - Token expiration
- `createdAt` - Token creation timestamp
- `updatedAt` - Last update timestamp

## API Routes

The authentication API is available at `/api/auth/*`:

- `POST /api/auth/sign-in/email` - Email/password sign in
- `POST /api/auth/sign-up/email` - Email/password sign up
- `GET /api/auth/sign-in/google` - Google OAuth redirect
- `GET /api/auth/callback/google` - Google OAuth callback
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session

These routes are automatically handled by better-auth via the catch-all route at `src/pages/api/auth/[...all].ts`.

## Security Best Practices

1. **Always use HTTPS in production** - Set `secure: true` for cookies
2. **Keep AUTH_SECRET secure** - Never commit it to version control
3. **Use strong passwords** - Enforce minimum password length (8+ characters)
4. **Enable email verification** - Set `requireEmailVerification: true` in production
5. **Implement rate limiting** - Protect against brute force attacks
6. **Regular security audits** - Keep dependencies updated

## Troubleshooting

### Authentication not working

1. Check that `AUTH_SECRET` is set in `.env`
2. Ensure database migrations have been applied (`pnpm db:migrate`)
3. Verify that environment variables are uncommented in `astro.config.mjs`
4. Check browser console for errors

### Google OAuth not working

1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
2. Check authorized redirect URIs in Google Cloud Console
3. Ensure Google+ API is enabled for your project
4. Verify the callback URL matches: `{PUBLIC_APP_URL}/api/auth/callback/google`

### Session not persisting

1. Check cookie settings in browser
2. Verify `PUBLIC_APP_URL` matches your domain
3. In production, ensure cookies are set with `secure: true`
4. Check browser console for cookie-related errors

## Further Reading

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Astro Authentication Guide](https://docs.astro.build/en/guides/authentication/)

## Support

For issues or questions:
- Check the [better-auth documentation](https://www.better-auth.com/docs)
- Review the example pages in `src/components/app/auth/pages/`
- Check the inline code comments in `src/lib/auth/`
