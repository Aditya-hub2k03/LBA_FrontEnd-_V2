import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getAllBookings, getAllProfiles, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/db/api';
import type { BookingWithDetails, Profile, Coupon } from '@/types/types';
import { Users, Calendar, Tag, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_amount: 0,
    max_discount: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usage_limit: 100,
    is_active: true,
  });

  useEffect(() => {
    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [profile, navigate]);

  const loadData = async () => {
    try {
      const [bookingsData, usersData, couponsData] = await Promise.all([
        getAllBookings(),
        getAllProfiles(),
        getAllCoupons(),
      ]);
      setBookings(bookingsData);
      setUsers(usersData);
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async () => {
    try {
      await createCoupon({
        ...newCoupon,
        valid_from: new Date(newCoupon.valid_from).toISOString(),
        valid_until: new Date(newCoupon.valid_until).toISOString(),
      });
      toast({
        title: 'Success',
        description: 'Coupon created successfully',
      });
      setDialogOpen(false);
      loadData();
      setNewCoupon({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_amount: 0,
        max_discount: 0,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usage_limit: 100,
        is_active: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create coupon',
        variant: 'destructive',
      });
    }
  };

  const handleToggleCoupon = async (couponId: string, isActive: boolean) => {
    try {
      await updateCoupon(couponId, { is_active: !isActive });
      toast({
        title: 'Success',
        description: `Coupon ${!isActive ? 'activated' : 'deactivated'}`,
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update coupon',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await deleteCoupon(couponId);
      toast({
        title: 'Success',
        description: 'Coupon deleted successfully',
      });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete coupon',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  const totalRevenue = bookings
    .filter((b) => b.payment_status === 'completed')
    .reduce((sum, b) => sum + b.final_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold gradient-text mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="glass-effect border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {coupons.filter((c) => c.is_active).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="coupons">Coupons</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage all bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="font-medium">
                              Booking #{booking.id.slice(0, 8)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(booking.booking_date).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge>{booking.payment_status}</Badge>
                            <div className="text-right">
                              <div className="font-bold">₹{booking.final_amount}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>Manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="font-medium">{user.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Discount Coupons</CardTitle>
                    <CardDescription>Manage discount coupons</CardDescription>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="neon-glow">Create Coupon</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Coupon</DialogTitle>
                        <DialogDescription>Add a new discount coupon</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Coupon Code</Label>
                          <Input
                            value={newCoupon.code}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                            }
                            placeholder="WELCOME50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={newCoupon.description}
                            onChange={(e) =>
                              setNewCoupon({ ...newCoupon, description: e.target.value })
                            }
                            placeholder="Welcome offer"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Discount Type</Label>
                            <Select
                              value={newCoupon.discount_type}
                              onValueChange={(value: 'percentage' | 'fixed') =>
                                setNewCoupon({ ...newCoupon, discount_type: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Discount Value</Label>
                            <Input
                              type="number"
                              value={newCoupon.discount_value}
                              onChange={(e) =>
                                setNewCoupon({
                                  ...newCoupon,
                                  discount_value: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Min Amount</Label>
                            <Input
                              type="number"
                              value={newCoupon.min_amount}
                              onChange={(e) =>
                                setNewCoupon({ ...newCoupon, min_amount: Number(e.target.value) })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Usage Limit</Label>
                            <Input
                              type="number"
                              value={newCoupon.usage_limit}
                              onChange={(e) =>
                                setNewCoupon({ ...newCoupon, usage_limit: Number(e.target.value) })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Valid From</Label>
                            <Input
                              type="date"
                              value={newCoupon.valid_from}
                              onChange={(e) =>
                                setNewCoupon({ ...newCoupon, valid_from: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Valid Until</Label>
                            <Input
                              type="date"
                              value={newCoupon.valid_until}
                              onChange={(e) =>
                                setNewCoupon({ ...newCoupon, valid_until: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={handleCreateCoupon} className="w-full">
                          Create Coupon
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coupons.map((coupon) => (
                    <Card key={coupon.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div className="font-bold text-primary">{coupon.code}</div>
                              <Badge variant={coupon.is_active ? 'default' : 'secondary'}>
                                {coupon.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {coupon.description}
                            </div>
                            <div className="text-sm">
                              {coupon.discount_type === 'percentage'
                                ? `${coupon.discount_value}% off`
                                : `₹${coupon.discount_value} off`}
                              {' • '}
                              Used: {coupon.used_count}
                              {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleCoupon(coupon.id, coupon.is_active)}
                            >
                              {coupon.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
