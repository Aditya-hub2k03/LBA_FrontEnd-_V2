/*
# Fix Booking RLS Policy

This migration adds a more permissive RLS policy for bookings to allow authenticated users to create bookings even if their profile hasn't been created yet.

## Changes
1. Add policy to allow any authenticated user to insert bookings
2. Keep existing policies for viewing and admin access

## Security
- Still requires authentication
- Users can only create bookings, not modify or delete
- Admins retain full access
*/

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings; 

-- Create a more permissive policy that allows any authenticated user to create bookings
CREATE POLICY "Authenticated users can create bookings" ON bookings
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Ensure users can still only view their own bookings
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Keep admin full access
-- (already exists, no need to recreate)
