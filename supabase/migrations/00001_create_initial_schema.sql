/*
# Create Initial Schema for LAQSHYA BADMINTON ACADEMY

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `phone` (text)
- `role` (user_role enum: 'user', 'admin')
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### venues
- `id` (uuid, primary key)
- `name` (text, not null)
- `description` (text)
- `address` (text)
- `created_at` (timestamptz)

### grounds
- `id` (uuid, primary key)
- `venue_id` (uuid, references venues)
- `name` (text, not null)
- `sport_type` (text, not null) - 'badminton', 'cricket', 'tennis'
- `ground_number` (integer, not null)
- `created_at` (timestamptz)

### time_slots
- `id` (uuid, primary key)
- `ground_id` (uuid, references grounds)
- `date` (date, not null)
- `start_time` (time, not null)
- `end_time` (time, not null)
- `price` (decimal, not null)
- `status` (slot_status enum: 'available', 'booked', 'blocked')
- `is_hot_selling` (boolean, default false)
- `created_at` (timestamptz)

### bookings
- `id` (uuid, primary key)
- `user_id` (uuid, references profiles)
- `slot_id` (uuid, references time_slots)
- `booking_date` (timestamptz, not null)
- `total_amount` (decimal, not null)
- `discount_amount` (decimal, default 0)
- `final_amount` (decimal, not null)
- `coupon_id` (uuid, references coupons, nullable)
- `payment_status` (payment_status enum: 'pending', 'completed', 'failed', 'refunded')
- `payment_id` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### coupons
- `id` (uuid, primary key)
- `code` (text, unique, not null)
- `description` (text)
- `discount_type` (discount_type enum: 'percentage', 'fixed')
- `discount_value` (decimal, not null)
- `min_amount` (decimal, default 0)
- `max_discount` (decimal)
- `valid_from` (timestamptz, not null)
- `valid_until` (timestamptz, not null)
- `usage_limit` (integer)
- `used_count` (integer, default 0)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

## 2. Security
- Enable RLS on all tables
- Profiles: Users can view/edit own profile, admins have full access
- Venues/Grounds: Public read, admin write
- Time Slots: Public read, admin write
- Bookings: Users can view own bookings, admins have full access
- Coupons: Public read (active only), admin full access

## 3. Functions
- `is_admin()` - Check if user is admin
- `handle_new_user()` - Trigger to create profile on auth signup (first user becomes admin)

## 4. Initial Data
- 3 venues with 6 grounds each (2 badminton, 2 cricket, 2 tennis per venue)
- Sample time slots for the next 7 days
- Sample discount coupons
*/

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE slot_status AS ENUM ('available', 'booked', 'blocked');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  full_name text,
  phone text,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create venues table
CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Create grounds table
CREATE TABLE IF NOT EXISTS grounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  sport_type text NOT NULL,
  ground_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ground_id uuid REFERENCES grounds(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  price decimal(10,2) NOT NULL,
  status slot_status DEFAULT 'available'::slot_status NOT NULL,
  is_hot_selling boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_type discount_type NOT NULL,
  discount_value decimal(10,2) NOT NULL,
  min_amount decimal(10,2) DEFAULT 0,
  max_discount decimal(10,2),
  valid_from timestamptz NOT NULL,
  valid_until timestamptz NOT NULL,
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  slot_id uuid REFERENCES time_slots(id) ON DELETE CASCADE NOT NULL,
  booking_date timestamptz DEFAULT now() NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  discount_amount decimal(10,2) DEFAULT 0,
  final_amount decimal(10,2) NOT NULL,
  coupon_id uuid REFERENCES coupons(id),
  payment_status payment_status DEFAULT 'pending'::payment_status NOT NULL,
  payment_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE grounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL USING (is_admin(auth.uid()));

-- Venues policies (public read, admin write)
CREATE POLICY "Venues are viewable by everyone" ON venues
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage venues" ON venues
  FOR ALL USING (is_admin(auth.uid()));

-- Grounds policies (public read, admin write)
CREATE POLICY "Grounds are viewable by everyone" ON grounds
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage grounds" ON grounds
  FOR ALL USING (is_admin(auth.uid()));

-- Time slots policies (public read, admin write)
CREATE POLICY "Time slots are viewable by everyone" ON time_slots
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage time slots" ON time_slots
  FOR ALL USING (is_admin(auth.uid()));

-- Bookings policies
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full access to bookings" ON bookings
  FOR ALL USING (is_admin(auth.uid()));

-- Coupons policies (public read active coupons, admin full access)
CREATE POLICY "Active coupons are viewable by everyone" ON coupons
  FOR SELECT USING (is_active = true AND valid_from <= now() AND valid_until >= now());

CREATE POLICY "Admins have full access to coupons" ON coupons
  FOR ALL USING (is_admin(auth.uid()));

-- Create trigger function for new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    SELECT COUNT(*) INTO user_count FROM profiles;
    INSERT INTO profiles (id, email, phone, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.phone,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Insert initial venues
INSERT INTO venues (name, description, address) VALUES
  ('LAQSHYA Main Arena', 'Our flagship venue with state-of-the-art facilities', 'Visakhapatnam, Andhra Pradesh'),
  ('LAQSHYA Sports Complex', 'Multi-sport complex with professional coaching', 'Visakhapatnam, Andhra Pradesh'),
  ('LAQSHYA Elite Center', 'Premium sports facility for serious athletes', 'Visakhapatnam, Andhra Pradesh');

-- Insert grounds for each venue
DO $$
DECLARE
  venue_rec RECORD;
BEGIN
  FOR venue_rec IN SELECT id FROM venues ORDER BY created_at LOOP
    -- 6 Badminton courts
    INSERT INTO grounds (venue_id, name, sport_type, ground_number) VALUES
      (venue_rec.id, 'Badminton Court 1', 'badminton', 1),
      (venue_rec.id, 'Badminton Court 2', 'badminton', 2),
      (venue_rec.id, 'Badminton Court 3', 'badminton', 3),
      (venue_rec.id, 'Badminton Court 4', 'badminton', 4),
      (venue_rec.id, 'Badminton Court 5', 'badminton', 5),
      (venue_rec.id, 'Badminton Court 6', 'badminton', 6);
    
    -- 6 Cricket nets
    INSERT INTO grounds (venue_id, name, sport_type, ground_number) VALUES
      (venue_rec.id, 'Cricket Net 1', 'cricket', 7),
      (venue_rec.id, 'Cricket Net 2', 'cricket', 8),
      (venue_rec.id, 'Cricket Net 3', 'cricket', 9),
      (venue_rec.id, 'Cricket Net 4', 'cricket', 10),
      (venue_rec.id, 'Cricket Net 5', 'cricket', 11),
      (venue_rec.id, 'Cricket Net 6', 'cricket', 12);
    
    -- 6 Tennis courts
    INSERT INTO grounds (venue_id, name, sport_type, ground_number) VALUES
      (venue_rec.id, 'Tennis Court 1', 'tennis', 13),
      (venue_rec.id, 'Tennis Court 2', 'tennis', 14),
      (venue_rec.id, 'Tennis Court 3', 'tennis', 15),
      (venue_rec.id, 'Tennis Court 4', 'tennis', 16),
      (venue_rec.id, 'Tennis Court 5', 'tennis', 17),
      (venue_rec.id, 'Tennis Court 6', 'tennis', 18);
  END LOOP;
END $$;

-- Insert time slots for next 7 days (6 AM to 10 PM, 30-minute intervals)
DO $$
DECLARE
  ground_rec RECORD;
  day_offset integer;
  slot_time time;
  slot_date date;
  slot_price decimal(10,2);
BEGIN
  FOR ground_rec IN SELECT id, sport_type FROM grounds LOOP
    -- Set price based on sport type
    slot_price := CASE 
      WHEN ground_rec.sport_type = 'badminton' THEN 500.00
      WHEN ground_rec.sport_type = 'cricket' THEN 800.00
      WHEN ground_rec.sport_type = 'tennis' THEN 600.00
      ELSE 500.00
    END;
    
    -- Generate slots for next 7 days
    FOR day_offset IN 0..6 LOOP
      slot_date := CURRENT_DATE + day_offset;
      slot_time := '06:00:00'::time;
      
      -- Generate slots from 6 AM to 10 PM (32 slots per day)
      WHILE slot_time < '22:00:00'::time LOOP
        INSERT INTO time_slots (ground_id, date, start_time, end_time, price, status, is_hot_selling)
        VALUES (
          ground_rec.id,
          slot_date,
          slot_time,
          slot_time + interval '30 minutes',
          slot_price,
          'available'::slot_status,
          -- Mark one random slot per day as hot selling
          (day_offset = 0 AND slot_time = '18:00:00'::time)
        );
        
        slot_time := slot_time + interval '30 minutes';
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- Insert sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_amount, max_discount, valid_from, valid_until, usage_limit, is_active) VALUES
  ('WELCOME50', 'Welcome offer - 50% off on first booking', 'percentage'::discount_type, 50.00, 500.00, 500.00, now(), now() + interval '30 days', 100, true),
  ('SPORTS100', 'Flat ₹100 off on bookings above ₹1000', 'fixed'::discount_type, 100.00, 1000.00, NULL, now(), now() + interval '60 days', 200, true),
  ('WEEKEND20', 'Weekend special - 20% off', 'percentage'::discount_type, 20.00, 300.00, 300.00, now(), now() + interval '90 days', NULL, true);
