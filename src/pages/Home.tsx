import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingScreen from '@/components/common/LoadingScreen';
import {
  Activity,
  Brain,
  Dumbbell,
  Heart,
  Wind,
  Car,
  Trees,
  Users,
  Coffee,
  Armchair,
  BookOpen,
  Calendar,
  CreditCard,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const sports = [
  {
    name: 'Badminton',
    icon: '🏸',
    description: 'Professional badminton courts with premium facilities',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/165fdb67-c15a-48d0-96cd-28f802981da9.jpg',
  },
  {
    name: 'Cricket',
    icon: '🏏',
    description: 'State-of-the-art cricket nets for practice',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/c33b6042-72ce-427c-9830-a1449ade86d0.jpg',
  },
  {
    name: 'Tennis',
    icon: '🎾',
    description: 'Premium tennis courts for all skill levels',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/f33e1214-94f6-44af-a684-6e604d68b9f7.jpg',
  },
];

const healthBenefits = [
  {
    title: 'Improved Fitness',
    description: 'Enhance cardiovascular health and overall physical fitness',
    icon: Heart,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/94ad0a38-f120-4604-a590-dd6e9b57d8e5.jpg',
  },
  {
    title: 'Better Focus',
    description: 'Sharpen mental clarity and concentration',
    icon: Brain,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/54978bc6-c236-4baa-b7a3-24694af04a19.jpg',
  },
  {
    title: 'Cultivates Discipline',
    description: 'Build self-discipline and dedication',
    icon: Trophy,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/d4473d28-76dc-485e-a4be-4c9cfdf77f78.jpg',
  },
  {
    title: 'Strength Training',
    description: 'Develop muscular strength and endurance',
    icon: Dumbbell,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/94ad0a38-f120-4604-a590-dd6e9b57d8e5.jpg',
  },
  {
    title: 'Cool Down',
    description: 'Proper recovery and flexibility exercises',
    icon: Wind,
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/94ad0a38-f120-4604-a590-dd6e9b57d8e5.jpg',
  },
];

const amenities = [
  { 
    title: 'Plenty of Parking', 
    icon: Car, 
    description: 'Ample parking space for all visitors',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/fb3f9300-7c72-41cb-b8a6-b42357b778b6.jpg'
  },
  { 
    title: 'Pleasant Environment', 
    icon: Trees, 
    description: 'Clean, pollution-free surroundings',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/6460e752-0dc3-4126-bd25-ca3decf051f0.jpg'
  },
  { 
    title: 'Professional Trainers', 
    icon: Users, 
    description: 'Expert coaching staff',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/62f1fa2b-c9a3-44db-9955-0c1419e139d9.jpg'
  },
  { 
    title: 'Soft Drinks', 
    icon: Coffee, 
    description: 'Refreshments available',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/ed8abd2a-2a8e-416e-b0f3-ce3197889aed.jpg'
  },
  { 
    title: 'Waiting Area', 
    icon: Armchair, 
    description: 'Comfortable seating area',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/fdddb0cc-ff1a-4a34-ae9e-e71cb32df48b.jpg'
  },
  { 
    title: 'Sports Library', 
    icon: BookOpen, 
    description: 'Reading and learning resources',
    image: 'https://miaoda-site-img.s3cdn.medo.dev/images/5cb4dc9a-5dba-4e8d-af6f-6de42f3a5c2f.jpg'
  },
];

const bookingSteps = [
  {
    step: 1,
    title: 'Select Your Sport',
    description: 'Choose from Badminton, Cricket, or Tennis',
    icon: Activity,
  },
  {
    step: 2,
    title: 'Select Your Slot',
    description: 'Pick your preferred venue, ground, and time',
    icon: Calendar,
  },
  {
    step: 3,
    title: 'Make Payment',
    description: 'Secure payment with discount coupons',
    icon: CreditCard,
  },
];

export default function Home() {
  const [currentSportIndex, setCurrentSportIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSportIndex((prev) => (prev + 1) % sports.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSport = () => {
    setCurrentSportIndex((prev) => (prev + 1) % sports.length);
  };

  const prevSport = () => {
    setCurrentSportIndex((prev) => (prev - 1 + sports.length) % sports.length);
  };

  const handleBookNow = (sport?: string) => {
    setNavigating(true);
    setTimeout(() => {
      if (sport) {
        navigate(`/booking?sport=${sport.toLowerCase()}`);
      } else {
        navigate('/booking');
      }
    }, 1000);
  };

  if (navigating) {
    return <LoadingScreen message="Preparing booking page..." />;
  }

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[700px] flex items-center overflow-hidden bg-gradient-to-br from-secondary via-background to-secondary">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <div className="absolute inset-0 bg-[url('https://miaoda-site-img.s3cdn.medo.dev/images/165fdb67-c15a-48d0-96cd-28f802981da9.jpg')] bg-cover bg-center" />
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <Badge variant="outline" className="text-sm px-4 py-2 border-primary/50">
                  Where Passion Meets Play
                </Badge>
              </div>
              
              <div>
                <h1 className="text-4xl xl:text-6xl font-bold mb-4">
                  <span className="text-foreground">LAQSHYA</span>
                  <br />
                  <span className="gradient-text">BADMINTON</span>
                  <br />
                  <span className="gradient-text">ACADEMY</span>
                </h1>
                <p className="text-lg xl:text-xl text-muted-foreground mt-6">
                  "Where Passion Meets Play"
                  <br />
                  Book • Play • Compete • Repeat
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="neon-glow text-lg px-8 py-6 w-full sm:w-auto"
                  onClick={() => handleBookNow()}
                >
                  Reserve Your Spot
                </Button>
                <Link to="/venues">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary/50 w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Two Image Cards */}
            <div className="hidden xl:grid grid-cols-2 gap-4">
              {/* Top Card - Premium Courts */}
              <div className="col-span-2 relative group overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/20 to-accent/20 p-6 hover-lift">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Premium Courts</h3>
                    <p className="text-sm text-muted-foreground">World-class facilities</p>
                  </div>
                  <div className="text-6xl">🏸</div>
                </div>
              </div>

              {/* Bottom Left Card - Professional Training */}
              <div className="relative group overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-secondary to-background p-6 hover-lift">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-foreground mb-2">Professional Training</h3>
                  <p className="text-xs text-muted-foreground">Expert coaches available</p>
                </div>
              </div>

              {/* Bottom Right Card - Large Image */}
              <div className="row-span-2 relative group overflow-hidden rounded-2xl border border-primary/20 hover-lift">
                <img 
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/4510a6ce-374e-4013-a8f5-660c92db7fd0.jpg"
                  alt="Badminton Action"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-4xl mb-2">🏸</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold gradient-text mb-4">
              Sports We Offer
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose your favorite sport and start playing
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out">
                {sports.map((sport, index) => (
                  <div
                    key={sport.name}
                    className={`w-full flex-shrink-0 px-4 transition-opacity duration-500 ${
                      index === currentSportIndex ? 'opacity-100' : 'opacity-0 absolute'
                    }`}
                  >
                    <Card className="glass-effect border-primary/20 hover-lift overflow-hidden">
                      <div className="grid xl:grid-cols-2 gap-6">
                        <div className="relative h-80 xl:h-96">
                          <img
                            src={sport.image}
                            alt={sport.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-8 flex flex-col justify-center">
                          <div className="text-6xl mb-4">{sport.icon}</div>
                          <CardTitle className="text-3xl mb-4">{sport.name}</CardTitle>
                          <CardDescription className="text-lg mb-6">
                            {sport.description}
                          </CardDescription>
                          <Button 
                            className="neon-glow"
                            onClick={() => handleBookNow(sport.name)}
                          >
                            Book {sport.name} Court
                          </Button>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={prevSport}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-primary text-primary-foreground p-3 rounded-full neon-glow hover-lift"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSport}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-primary text-primary-foreground p-3 rounded-full neon-glow hover-lift"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {sports.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSportIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSportIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold gradient-text mb-4">
              Reserve Your Spot in 3 Steps
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple and quick booking process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bookingSteps.map((step) => (
              <Card
                key={step.step}
                className="glass-effect border-primary/20 hover-lift text-center"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <Badge className="mx-auto mb-2 neon-glow">Step {step.step}</Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Divider Section */}
      <section className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.4}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/15be6abe-d1f4-4070-9455-f13bf003a4cb.jpg"
            alt="Badminton Court"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
              World-Class Facilities
            </h3>
            <p className="text-lg text-muted-foreground">
              Experience premium sports infrastructure
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold gradient-text mb-4">
              Health Benefits
            </h2>
            <p className="text-muted-foreground text-lg">
              Transform your body and mind through sports
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {healthBenefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="glass-effect border-primary/20 hover-lift overflow-hidden"
              >
                <div className="relative h-48">
                  <img
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Divider Section 2 - Cricket */}
      <section className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.35}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/5b37902a-970f-49ff-bfbe-1a2f761d5f68.jpg"
            alt="Cricket Nets"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
              Multi-Sport Excellence
            </h3>
            <p className="text-lg text-muted-foreground">
              Cricket, Tennis, and Badminton under one roof
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold gradient-text mb-4">
              Our Amenities
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need for a perfect sports experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {amenities.map((amenity) => (
              <Card
                key={amenity.title}
                className="glass-effect border-primary/20 hover-lift overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={amenity.image}
                    alt={amenity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-accent/20">
                      <amenity.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{amenity.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{amenity.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Divider Section 3 - Tennis */}
      <section className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.45}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          <img
            src="https://miaoda-site-img.s3cdn.medo.dev/images/29b866dc-3b68-431f-a17c-939e8998fe9c.jpg"
            alt="Tennis Court"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/65" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-3xl xl:text-4xl font-bold text-foreground mb-4">
              Premium Amenities
            </h3>
            <p className="text-lg text-muted-foreground">
              Everything you need for the perfect sports experience
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold gradient-text mb-4">
              Find Us
            </h2>
            <p className="text-muted-foreground text-lg">
              Visit us at Visakhapatnam, Andhra Pradesh
            </p>
          </div>

          <Card className="glass-effect border-primary/20 overflow-hidden">
            <CardContent className="p-0">
              <iframe
                src="https://www.google.com/maps?q=17.6887,83.1774&hl=en&z=14&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="LAQSHYA Location"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
