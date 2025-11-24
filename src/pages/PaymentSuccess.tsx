import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, MapPin, Clock, CreditCard, Tag, QrCode } from 'lucide-react';
import QRCodeDataUrl from '@/components/ui/qrcodedataurl';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const bookingDetails = {
    bookingId: searchParams.get('bookingId') || 'BK' + Date.now(),
    sport: searchParams.get('sport') || 'Badminton',
    venue: searchParams.get('venue') || 'LAQSHYA Main Arena',
    ground: searchParams.get('ground') || 'Badminton Court 1',
    date: searchParams.get('date') || new Date().toLocaleDateString(),
    time: searchParams.get('time') || '6:00 PM - 7:00 PM',
    amount: searchParams.get('amount') || '500',
    coupon: searchParams.get('coupon') || null,
    discount: searchParams.get('discount') || '0',
  };

  // Generate QR code data with all booking details
  const qrData = JSON.stringify({
    bookingId: bookingDetails.bookingId,
    sport: bookingDetails.sport,
    venue: bookingDetails.venue,
    ground: bookingDetails.ground,
    date: bookingDetails.date,
    time: bookingDetails.time,
    amount: Number(bookingDetails.amount) - Number(bookingDetails.discount),
  });

  useEffect(() => {
    // Confetti effect or celebration animation can be added here
    document.title = 'Payment Successful - LAQSHYA';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl glass-effect border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-24 w-24 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl xl:text-4xl font-bold gradient-text">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg">
            Your booking has been confirmed. Get ready to play!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-secondary/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Booking ID</span>
              <span className="font-mono font-bold text-primary">{bookingDetails.bookingId}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">{bookingDetails.date}</p>
                  <p className="text-sm">{bookingDetails.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Venue & Ground</p>
                  <p className="font-semibold">{bookingDetails.venue}</p>
                  <p className="text-sm">{bookingDetails.ground}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Sport</p>
                  <p className="font-semibold">{bookingDetails.sport}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Base Amount</span>
              <span className="font-semibold">₹{bookingDetails.amount}</span>
            </div>

            {bookingDetails.coupon && (
              <div className="flex items-center justify-between text-primary">
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Discount ({bookingDetails.coupon})
                </span>
                <span className="font-semibold">-₹{bookingDetails.discount}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="flex items-center gap-2 font-bold text-lg">
                <CreditCard className="h-5 w-5 text-primary" />
                Total Paid
              </span>
              <span className="font-bold text-2xl text-primary">
                ₹{Number(bookingDetails.amount) - Number(bookingDetails.discount)}
              </span>
            </div>
          </div>

          <div className="bg-secondary/30 rounded-lg p-6 border border-primary/20">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-primary">
                <QrCode className="h-5 w-5" />
                <span className="font-semibold">Booking QR Code</span>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <QRCodeDataUrl 
                  text={qrData} 
                  width={200}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Show this QR code at the venue for quick check-in
              </p>
            </div>
          </div>

          <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
            <p className="text-sm text-center">
              📧 A confirmation email has been sent to your registered email address.
              <br />
              Please arrive 10 minutes before your scheduled time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="flex-1 neon-glow"
              size="lg"
            >
              View My Bookings
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              Back to Home
            </Button>
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/booking')}
              variant="link"
              className="text-primary"
            >
              Book Another Slot →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
