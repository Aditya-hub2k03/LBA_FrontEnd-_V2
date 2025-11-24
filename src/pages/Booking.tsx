import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getVenues, getGrounds, getTimeSlots, createBooking, getActiveCoupons, getCouponByCode, calculateDiscount } from '@/db/api';
import type { Venue, Ground, TimeSlot, Coupon, SportType } from '@/types/types';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState<SportType | ''>((searchParams.get('sport') as SportType) || '');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [selectedGround, setSelectedGround] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVenues();
    loadCoupons();
  }, []);

  useEffect(() => {
    if (selectedSport && selectedVenue) {
      loadGrounds();
    }
  }, [selectedSport, selectedVenue]);

  useEffect(() => {
    if (selectedGround && selectedDate) {
      loadTimeSlots();
    }
  }, [selectedGround, selectedDate]);

  const loadVenues = async () => {
    try {
      const data = await getVenues();
      setVenues(data);
    } catch (error) {
      console.error('Error loading venues:', error);
    }
  };

  const loadGrounds = async () => {
    try {
      const data = await getGrounds(selectedVenue, selectedSport as SportType);
      setGrounds(data);
    } catch (error) {
      console.error('Error loading grounds:', error);
    }
  };

  const loadTimeSlots = async () => {
    try {
      const data = await getTimeSlots(selectedGround, selectedDate);
      setTimeSlots(data);
    } catch (error) {
      console.error('Error loading time slots:', error);
    }
  };

  const loadCoupons = async () => {
    try {
      const data = await getActiveCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode || !selectedSlot) return;

    try {
      const coupon = await getCouponByCode(couponCode);
      if (!coupon) {
        toast({
          title: 'Invalid Coupon',
          description: 'Coupon code not found or expired',
          variant: 'destructive',
        });
        return;
      }

      const result = calculateDiscount(coupon, selectedSlot.price);
      if (!result.isValid) {
        toast({
          title: 'Invalid Coupon',
          description: result.message,
          variant: 'destructive',
        });
        return;
      }

      setAppliedCoupon(coupon);
      toast({
        title: 'Coupon Applied',
        description: `You saved ₹${result.discountAmount.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply coupon',
        variant: 'destructive',
      });
    }
  };

  const handleBooking = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to book a slot',
        variant: 'destructive',
      });
      navigate('/login', { state: { from: { pathname: '/booking' } } });
      return;
    }

    if (!selectedSlot) return;

    setLoading(true);
    try {
      console.log('Starting booking process...');
      console.log('User:', user);
      console.log('Selected Slot:', selectedSlot);
      
      const totalAmount = selectedSlot.price;
      const discount = appliedCoupon ? calculateDiscount(appliedCoupon, totalAmount) : null;
      const discountAmount = discount?.discountAmount || 0;
      const finalAmount = discount?.finalAmount || totalAmount;

      const bookingData = {
        user_id: user.id,
        slot_id: selectedSlot.id,
        booking_date: new Date().toISOString(),
        total_amount: totalAmount,
        discount_amount: discountAmount,
        final_amount: finalAmount,
        coupon_id: appliedCoupon?.id || null,
        payment_status: 'completed' as const,
        payment_id: `MOCK_${Date.now()}`,
      };
      
      console.log('Booking data:', bookingData);

      const booking = await createBooking(bookingData);
      
      console.log('Booking created:', booking);

      toast({
        title: 'Booking Successful',
        description: 'Your slot has been booked successfully',
      });

      // Redirect to payment success page with booking details
      const params = new URLSearchParams({
        bookingId: booking?.id || '',
        sport: selectedSport || 'Badminton',
        venue: venues.find(v => v.id === selectedVenue)?.name || '',
        ground: grounds.find(g => g.id === selectedGround)?.name || '',
        date: new Date(selectedDate).toLocaleDateString(),
        time: selectedSlot.start_time + ' - ' + selectedSlot.end_time,
        amount: totalAmount.toString(),
        coupon: appliedCoupon?.code || '',
        discount: discountAmount.toString(),
      });
      
      navigate(`/payment-success?${params.toString()}`);
    } catch (error) {
      console.error('Booking error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
      console.error('Error message:', errorMessage);
      
      toast({
        title: 'Booking Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatusClass = (slot: TimeSlot) => {
    if (slot.is_hot_selling) return 'slot-hot';
    if (slot.status === 'available') return 'slot-available';
    if (slot.status === 'booked') return 'slot-booked';
    return 'slot-blocked';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Book Your Slot</h1>
          <p className="text-muted-foreground text-lg">Follow the steps to complete your booking</p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s ? 'bg-primary text-primary-foreground neon-glow' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Step 1: Select Your Sport</CardTitle>
              <CardDescription>Choose the sport you want to play</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {['badminton', 'cricket', 'tennis'].map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport as SportType)}
                    className={`p-6 rounded-lg border-2 transition-all hover-lift ${
                      selectedSport === sport
                        ? 'border-primary bg-primary/10 neon-glow'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-4xl mb-2">
                      {sport === 'badminton' ? '🏸' : sport === 'cricket' ? '🏏' : '🎾'}
                    </div>
                    <div className="font-semibold capitalize">{sport}</div>
                  </button>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedSport}
                className="w-full neon-glow"
              >
                Continue to Slot Selection
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="glass-effect border-primary/20 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Step 2: Select Your Slot</CardTitle>
              <CardDescription>Choose venue, ground, date, and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Venue</Label>
                  <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Ground</Label>
                  <Select value={selectedGround} onValueChange={setSelectedGround} disabled={!selectedVenue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ground" />
                    </SelectTrigger>
                    <SelectContent>
                      {grounds.map((ground) => (
                        <SelectItem key={ground.id} value={ground.id}>
                          {ground.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {timeSlots.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Available Time Slots</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => slot.status === 'available' && setSelectedSlot(slot)}
                        disabled={slot.status !== 'available'}
                        className={`p-4 rounded-lg border-2 transition-all text-sm ${getSlotStatusClass(slot)} ${
                          selectedSlot?.id === slot.id ? 'ring-2 ring-primary' : ''
                        } ${slot.status === 'available' ? 'hover-lift cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-semibold">
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                          </span>
                        </div>
                        <div className="text-xs">₹{slot.price}</div>
                        {slot.is_hot_selling && (
                          <Badge className="mt-1 text-xs">Hot</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded slot-available" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded slot-booked" />
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded slot-blocked" />
                      <span>Blocked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded slot-hot" />
                      <span>Hot Selling</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedSlot}
                  className="flex-1 neon-glow"
                >
                  Continue to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && selectedSlot && (
          <Card className="glass-effect border-primary/20 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Step 3: Make Payment</CardTitle>
              <CardDescription>Review your booking and apply discounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sport:</span>
                    <span className="font-medium capitalize">{selectedSport}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">
                      {selectedSlot.start_time.slice(0, 5)} - {selectedSlot.end_time.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Base Price:</span>
                    <span className="font-medium">₹{selectedSlot.price}</span>
                  </div>
                  {appliedCoupon && (
                    <>
                      <div className="flex justify-between text-success">
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span>-₹{calculateDiscount(appliedCoupon, selectedSlot.price).discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold text-lg">
                        <span>Final Amount:</span>
                        <span>₹{calculateDiscount(appliedCoupon, selectedSlot.price).finalAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  {!appliedCoupon && (
                    <div className="flex justify-between pt-2 border-t font-bold text-lg">
                      <span>Total Amount:</span>
                      <span>₹{selectedSlot.price}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Apply Discount Coupon
                </h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button onClick={applyCoupon} variant="outline">
                    Apply
                  </Button>
                </div>
                {coupons.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Available Coupons:</p>
                    <div className="grid gap-2">
                      {coupons.map((coupon) => (
                        <button
                          key={coupon.id}
                          onClick={() => {
                            setCouponCode(coupon.code);
                            setAppliedCoupon(coupon);
                          }}
                          className="p-3 rounded-lg border border-border hover:border-primary/50 text-left transition-all hover-lift"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-primary">{coupon.code}</div>
                              <div className="text-sm text-muted-foreground">{coupon.description}</div>
                            </div>
                            <Badge variant="outline">
                              {coupon.discount_type === 'percentage'
                                ? `${coupon.discount_value}%`
                                : `₹${coupon.discount_value}`}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 neon-glow"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
