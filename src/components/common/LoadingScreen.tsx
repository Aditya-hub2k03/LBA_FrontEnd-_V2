import React, { useEffect, useState } from 'react';

const sportsImages = [
  'https://miaoda-site-img.s3cdn.medo.dev/images/d635f8be-6d97-4fc6-a737-c079f59a719d.jpg', // Badminton
  'https://miaoda-site-img.s3cdn.medo.dev/images/dd503b9b-8a4b-4314-ab2b-145dee844007.jpg', // Cricket
  'https://miaoda-site-img.s3cdn.medo.dev/images/31d3061f-f7a7-43a2-ada4-5390845dbf47.jpg', // Tennis
  'https://miaoda-site-img.s3cdn.medo.dev/images/b29f687e-6331-4c8d-aea0-187d88aee9d2.jpg', // Running
  'https://miaoda-site-img.s3cdn.medo.dev/images/2cb1fa30-7c62-4ca5-94f6-b74442645458.jpg', // Basketball
  'https://miaoda-site-img.s3cdn.medo.dev/images/8599a9f0-16e2-4632-8e4f-e7966867b049.jpg', // Training
];

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sportsImages.length);
    }, 800); // Change image every 800ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold gradient-text mb-2">
            LAQSHYA BADMINTON ACADEMY
          </h1>
          <p className="text-muted-foreground">Where Passion Meets Play</p>
        </div>

        {/* Animated Sports Images */}
        <div className="relative w-64 h-64 mx-auto">
          {sportsImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Sports action ${index + 1}`}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Loading Message */}
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          
          {/* Loading Spinner */}
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden mx-auto">
          <div className="h-full bg-gradient-to-r from-primary to-accent animate-loading-bar" />
        </div>
      </div>
    </div>
  );
}
