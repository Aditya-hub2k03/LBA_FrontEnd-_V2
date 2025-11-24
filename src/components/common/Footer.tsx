import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: 'Subscribed!',
        description: 'You will never miss any updates from us.',
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-secondary border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold gradient-text mb-4">
              Never Miss Any Updates
            </h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for exclusive offers and updates
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" className="neon-glow">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">About Us</h3>
            <p className="text-muted-foreground">
              LAQSHYA BADMINTON ACADEMY is committed to providing world-class sports
              facilities and professional training to help athletes achieve their goals.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contact Information</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-accent mt-0.5" />
                <p>Visakhapatnam, Andhra Pradesh<br />17.6887° N, 83.1774° E</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent" />
                <p>+91 XXXX-XXXXXX</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                <p>info@laqshya.com</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Operating Hours</h3>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-accent mt-0.5" />
                <div>
                  <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
                  <p>Saturday - Sunday: 6:00 AM - 10:00 PM</p>
                  <p className="mt-2 text-sm">Advance booking required</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground">
            {currentYear} LAQSHYA BADMINTON ACADEMY
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            All Rights Reserved | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
