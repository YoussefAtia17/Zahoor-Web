# Supabase Setup Guide for Zahoor Website

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account or sign in
3. Click "New Project"
4. Choose your organization
5. Fill in your project details:
   - Name: `zahoor-website` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose the closest region to your users
6. Click "Create new project"

## Step 2: Get Your Project Credentials

1. Once your project is created, go to the project dashboard
2. Click on "Settings" in the left sidebar
3. Click on "API" under Settings
4. You'll see two important values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Configure Your Website

1. Open the file `supabase-config.js` in your project
2. Replace the placeholder values:

```javascript
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

## Step 4: Set Up Authentication

1. In your Supabase dashboard, go to "Authentication" in the left sidebar
2. Click on "Settings"
3. Configure the following:

### Site URL
- Set your site URL (e.g., `http://localhost:3000` for local development or your actual domain)

### Email Templates (Optional)
- You can customize the email templates for sign-up confirmation and password reset

### Providers (Optional)
- You can enable social login providers like Google, GitHub, etc.

## Step 5: Test Your Setup

1. Open your website in a browser
2. Try to sign up with a new email address
3. Check your email for a confirmation link
4. Try to sign in with your credentials

## Important Notes

- **Email Confirmation**: By default, Supabase requires email confirmation for new users. Users will receive an email with a confirmation link.
- **Security**: Never commit your Supabase credentials to a public repository. Consider using environment variables for production.
- **Database**: Supabase automatically creates user tables and handles authentication. You don't need to set up any database tables manually.

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Make sure you copied the anon public key correctly
2. **"Invalid URL"**: Ensure the project URL is correct and includes `https://`
3. **Email not received**: Check spam folder, or check if email confirmation is enabled in Supabase settings
4. **CORS errors**: Make sure your site URL is configured correctly in Supabase settings

### Getting Help:

- Check the [Supabase Documentation](https://supabase.com/docs)
- Visit the [Supabase Community](https://github.com/supabase/supabase/discussions)

## Next Steps

Once authentication is working:
1. You can add user profiles
2. Set up row-level security (RLS) for your data
3. Add more features like password reset
4. Implement social login providers

Your authentication system is now ready to use with real user accounts!
