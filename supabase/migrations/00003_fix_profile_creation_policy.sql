/*
# Fix Profile Creation Policy

This migration ensures that profiles can be created for authenticated users, either by trigger or manually.

## Changes
1. Add policy to allow authenticated users to insert their own profile
2. Keep existing policies for viewing and updating

## Security
- Users can only create their own profile (id must match auth.uid())
- Users cannot change their role
- Admins retain full access
*/

-- Add policy to allow users to create their own profile
CREATE POLICY "Users can create own profile" ON profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Ensure the existing policies are correct
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile without changing role" ON profiles;
CREATE POLICY "Users can update own profile without changing role" ON profiles
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id AND role IS NOT DISTINCT FROM (SELECT role FROM profiles WHERE id = auth.uid()));