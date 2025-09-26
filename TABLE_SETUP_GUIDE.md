# Table Setup Guide for "Data of Users"

## ✅ What You've Done
- Created a table called "Data of Users"
- Added columns: `id`, `created_at`, `email`, `name`
- Configured Supabase credentials

## 🔧 Important: Set Up Table Permissions

For the authentication system to work properly, you need to configure Row Level Security (RLS) for your table.

### Step 1: Enable RLS
1. Go to your Supabase dashboard
2. Navigate to "Table Editor" in the left sidebar
3. Find your "Data of Users" table
4. Click on the table name
5. Click on "Settings" (gear icon)
6. Enable "Row Level Security (RLS)"

### Step 2: Create Policies
You need to create policies to allow users to insert and read their own data.

#### Policy 1: Allow Insert for Authenticated Users
1. In the table settings, click "Add Policy"
2. Choose "Create a policy from scratch"
3. Policy name: `Allow authenticated users to insert`
4. Policy command: `INSERT`
5. Target roles: `authenticated`
6. Policy definition: `true` (allows all authenticated users to insert)

#### Policy 2: Allow Users to Read Their Own Data
1. Click "Add Policy" again
2. Choose "Create a policy from scratch"
3. Policy name: `Users can read their own data`
4. Policy command: `SELECT`
5. Target roles: `authenticated`
6. Policy definition: `auth.uid()::text = email` (if you want to match by email)

**Alternative Policy 2** (if you want to use user ID):
- Policy definition: `auth.uid() = user_id` (you'd need to add a `user_id` column)

### Step 3: Test the Setup
1. Try signing up with a new email address
2. Check your "Data of Users" table in Supabase dashboard
3. You should see the new user's email and name

## 🚨 Troubleshooting

### Common Issues:

1. **"new row violates row-level security policy"**
   - Make sure RLS is enabled and you have an INSERT policy
   - Check that the policy allows authenticated users

2. **Data not appearing in table**
   - Check browser console for errors
   - Verify table name is exactly "Data of Users" (case-sensitive)
   - Make sure columns are named exactly: `email` and `name`

3. **"relation does not exist"**
   - Double-check the table name spelling
   - Make sure the table exists in the correct schema (usually `public`)

### Quick SQL Setup (Alternative)
If you prefer SQL, you can run these commands in the Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE "Data of Users" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON "Data of Users"
FOR INSERT TO authenticated
WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read their own data" ON "Data of Users"
FOR SELECT TO authenticated
USING (auth.email() = email);
```

## 📊 Expected Table Structure

Your table should have these columns:
- `id` (bigint, primary key, auto-increment)
- `created_at` (timestamp with time zone, default: now())
- `email` (text)
- `name` (text)

## 🎯 How It Works Now

1. **User signs up** → Account created in Supabase Auth
2. **Data saved** → Email and name saved to your "Data of Users" table
3. **Profile display** → Shows name from your custom table
4. **Secure access** → RLS ensures users only see their own data

## 🔍 Testing Steps

1. Open your website: http://localhost:8000
2. Click "Sign Up"
3. Fill in the form with:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
4. Check your email for verification
5. After verification, check your Supabase table
6. You should see the new record with email and name

The system is now fully integrated with your custom table!
