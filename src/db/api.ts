import { supabase } from './supabase';
import type {
  Profile,
  Venue,
  Ground,
  TimeSlot,
  Booking,
  Coupon,
  BookingWithDetails,
  GroundWithSlots,
  SportType,
  SlotStatus,
} from '@/types/types';

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Venue APIs
export const getVenues = async (): Promise<Venue[]> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getVenue = async (venueId: string): Promise<Venue | null> => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Ground APIs
export const getGrounds = async (venueId?: string, sportType?: SportType): Promise<Ground[]> => {
  let query = supabase.from('grounds').select('*');
  
  if (venueId) {
    query = query.eq('venue_id', venueId);
  }
  
  if (sportType) {
    query = query.eq('sport_type', sportType);
  }
  
  query = query.order('ground_number', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getGroundWithSlots = async (
  groundId: string,
  date: string
): Promise<GroundWithSlots | null> => {
  const { data: ground, error: groundError } = await supabase
    .from('grounds')
    .select('*, venue:venues(*)')
    .eq('id', groundId)
    .maybeSingle();
  
  if (groundError) throw groundError;
  if (!ground) return null;
  
  const { data: slots, error: slotsError } = await supabase
    .from('time_slots')
    .select('*')
    .eq('ground_id', groundId)
    .eq('date', date)
    .order('start_time', { ascending: true });
  
  if (slotsError) throw slotsError;
  
  return {
    ...ground,
    slots: Array.isArray(slots) ? slots : [],
  };
};

// Time Slot APIs
export const getTimeSlots = async (
  groundId: string,
  date: string
): Promise<TimeSlot[]> => {
  const { data, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('ground_id', groundId)
    .eq('date', date)
    .order('start_time', { ascending: true });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAvailableSlots = async (
  sportType: SportType,
  date: string,
  venueId?: string
): Promise<TimeSlot[]> => {
  let query = supabase
    .from('time_slots')
    .select('*, ground:grounds!inner(*)')
    .eq('date', date)
    .eq('status', 'available');
  
  if (sportType) {
    query = query.eq('ground.sport_type', sportType);
  }
  
  if (venueId) {
    query = query.eq('ground.venue_id', venueId);
  }
  
  query = query.order('start_time', { ascending: true });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateSlotStatus = async (
  slotId: string,
  status: SlotStatus
): Promise<TimeSlot | null> => {
  const { data, error } = await supabase
    .from('time_slots')
    .update({ status })
    .eq('id', slotId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateSlotPrice = async (
  slotId: string,
  price: number
): Promise<TimeSlot | null> => {
  const { data, error } = await supabase
    .from('time_slots')
    .update({ price })
    .eq('id', slotId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Booking APIs
export const createBooking = async (
  booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
): Promise<Booking | null> => {
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('You must be logged in to create a booking. Please sign up or log in first.');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .maybeSingle();
  
  if (error) {
    console.error('Booking creation error:', error);
    if (error.code === '42501') {
      throw new Error('Permission denied. Please ensure you are logged in with a valid account.');
    }
    throw new Error(error.message || 'Failed to create booking');
  }
  
  // Update slot status to booked
  if (data) {
    await updateSlotStatus(booking.slot_id, 'booked');
  }
  
  return data;
};

export const getUserBookings = async (userId: string): Promise<BookingWithDetails[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      slot:time_slots(*),
      coupon:coupons(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getAllBookings = async (): Promise<BookingWithDetails[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      slot:time_slots(*),
      coupon:coupons(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateBookingPaymentStatus = async (
  bookingId: string,
  paymentStatus: string,
  paymentId?: string
): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      payment_status: paymentStatus,
      payment_id: paymentId,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

// Coupon APIs
export const getActiveCoupons = async (): Promise<Coupon[]> => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .lte('valid_from', new Date().toISOString())
    .gte('valid_until', new Date().toISOString())
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getCouponByCode = async (code: string): Promise<Coupon | null> => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const getAllCoupons = async (): Promise<Coupon[]> => {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const createCoupon = async (
  coupon: Omit<Coupon, 'id' | 'created_at' | 'used_count'>
): Promise<Coupon | null> => {
  const { data, error } = await supabase
    .from('coupons')
    .insert({ ...coupon, code: coupon.code.toUpperCase() })
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const updateCoupon = async (
  couponId: string,
  updates: Partial<Coupon>
): Promise<Coupon | null> => {
  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', couponId)
    .select()
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const deleteCoupon = async (couponId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', couponId);
  
  if (error) throw error;
  return true;
};

export const incrementCouponUsage = async (couponId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_coupon_usage', {
    coupon_id: couponId
  });
  
  if (error) {
    // Fallback if RPC doesn't exist
    const coupon = await supabase
      .from('coupons')
      .select('used_count')
      .eq('id', couponId)
      .maybeSingle();
    
    if (coupon.data) {
      await supabase
        .from('coupons')
        .update({ used_count: (coupon.data.used_count || 0) + 1 })
        .eq('id', couponId);
    }
  }
};

// Calculate discount
export const calculateDiscount = (
  coupon: Coupon,
  amount: number
): { discountAmount: number; finalAmount: number; isValid: boolean; message?: string } => {
  // Check minimum amount
  if (amount < coupon.min_amount) {
    return {
      discountAmount: 0,
      finalAmount: amount,
      isValid: false,
      message: `Minimum amount of ₹${coupon.min_amount} required`,
    };
  }
  
  // Check usage limit
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return {
      discountAmount: 0,
      finalAmount: amount,
      isValid: false,
      message: 'Coupon usage limit reached',
    };
  }
  
  let discountAmount = 0;
  
  if (coupon.discount_type === 'percentage') {
    discountAmount = (amount * coupon.discount_value) / 100;
    if (coupon.max_discount) {
      discountAmount = Math.min(discountAmount, coupon.max_discount);
    }
  } else {
    discountAmount = coupon.discount_value;
  }
  
  const finalAmount = Math.max(0, amount - discountAmount);
  
  return {
    discountAmount,
    finalAmount,
    isValid: true,
  };
};
