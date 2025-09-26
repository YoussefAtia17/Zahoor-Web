-- SIMPLE FIX: Allow anyone to insert data into "Data of Users" table
-- Copy and paste this into Supabase SQL Editor and click RUN

-- Turn OFF Row Level Security (easiest solution)
ALTER TABLE "Data of Users" DISABLE ROW LEVEL SECURITY;

-- Grant full permissions to everyone
GRANT ALL ON "Data of Users" TO anon;
GRANT ALL ON "Data of Users" TO authenticated;

-- Test: This should show your table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Data of Users';
