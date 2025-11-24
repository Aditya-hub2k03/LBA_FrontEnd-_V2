import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getVenues, getGrounds } from '@/db/api';
import type { Venue, Ground } from '@/types/types';
import { MapPin, Calendar } from 'lucide-react';

export default function Venues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [groundsByVenue, setGroundsByVenue] = useState<Record<string, Ground[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const venuesData = await getVenues();
      setVenues(venuesData);

      const groundsData: Record<string, Ground[]> = {};
      for (const venue of venuesData) {
        const grounds = await getGrounds(venue.id);
        groundsData[venue.id] = grounds;
      }
      setGroundsByVenue(groundsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Our Venues</h1>
          <p className="text-muted-foreground text-lg">
            Explore our world-class sports facilities
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <Card key={venue.id} className="glass-effect border-primary/20 hover-lift">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{venue.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {venue.address}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{venue.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Available Grounds:</h4>
                  <div className="flex flex-wrap gap-2">
                    {groundsByVenue[venue.id]?.map((ground) => (
                      <Badge key={ground.id} variant="outline" className="capitalize">
                        {ground.sport_type === 'badminton' && '🏸'}
                        {ground.sport_type === 'cricket' && '🏏'}
                        {ground.sport_type === 'tennis' && '🎾'}
                        {' '}
                        {ground.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Link to="/booking">
                  <Button className="w-full neon-glow">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
