export type UserRole = 'user' | 'admin';
export type SlotStatus = 'available' | 'booked' | 'blocked';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type DiscountType = 'percentage' | 'fixed';
export type SportType = 'badminton' | 'cricket' | 'tennis';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  created_at: string;
}

export interface Ground {
  id: string;
  venue_id: string;
  name: string;
  sport_type: SportType;
  ground_number: number;
  created_at: string;
}

export interface TimeSlot {
  id: string;
  ground_id: string;
  date: string;
  start_time: string;
  end_time: string;
  price: number;
  status: SlotStatus;
  is_hot_selling: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  slot_id: string;
  booking_date: string;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  coupon_id: string | null;
  payment_status: PaymentStatus;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_amount: number;
  max_discount: number | null;
  valid_from: string;
  valid_until: string;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  created_at: string;
}

export interface BookingWithDetails extends Booking {
  slot?: TimeSlot;
  ground?: Ground;
  venue?: Venue;
  coupon?: Coupon;
}

export interface GroundWithSlots extends Ground {
  slots?: TimeSlot[];
  venue?: Venue;
}
