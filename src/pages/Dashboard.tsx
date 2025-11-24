import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getUserBookings, updateProfile } from '@/db/api';
import type { BookingWithDetails } from '@/types/types';
import { Calendar, Clock, MapPin, CreditCard, User, Mail, Phone } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const loadBookings = async () => {
    if (!user) return;
    try {
      const data = await getUserBookings(user.id);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user.id, {
        full_name: fullName,
        phone: phone,
      });
      await refreshProfile();
      setEditMode(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold gradient-text mb-8">My Dashboard</h1>

        <div className="grid xl:grid-cols-3 gap-6 mb-8">
          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {editMode ? (
                <>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="flex-1">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{profile?.full_name || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{profile?.email || 'Not set'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{profile?.phone || 'Not set'}</span>
                    </div>
                  </div>
                  <Button onClick={() => setEditMode(true)} className="w-full">
                    Edit Profile
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold gradient-text">{bookings.length}</div>
              <p className="text-muted-foreground mt-2">All time bookings</p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20">
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold gradient-text">
                ₹{bookings.reduce((sum, b) => sum + b.final_amount, 0).toFixed(2)}
              </div>
              <p className="text-muted-foreground mt-2">All time spending</p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-effect border-primary/20">
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>View all your past and upcoming bookings</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button onClick={() => window.location.href = '/booking'}>
                  Book Your First Slot
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {new Date(booking.booking_date).toLocaleDateString()}
                            </span>
                            {getStatusBadge(booking.payment_status)}
                          </div>
                          {booking.slot && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>
                                {booking.slot.start_time?.slice(0, 5)} - {booking.slot.end_time?.slice(0, 5)}
                              </span>
                            </div>
                          )}
                          {booking.coupon && (
                            <div className="flex items-center gap-2 text-sm text-success">
                              <CreditCard className="h-4 w-4" />
                              <span>Coupon: {booking.coupon.code}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">₹{booking.final_amount}</div>
                          {booking.discount_amount > 0 && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{booking.total_amount}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
