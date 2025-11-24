# LAQSHYA BADMINTON ACADEMY - Project Guide

## Overview
A comprehensive sports slot booking platform for LAQSHYA BADMINTON ACADEMY, featuring real-time availability tracking, user management, admin controls, and integrated payment processing.

## Technology Stack
- **Frontend**: React + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: Supabase Auth (Username/Password + Google SSO)
- **Payment**: Razorpay (Mock integration ready for production)
- **Maps**: Google Maps API

## Features

### User Features
1. **Sports Booking System**
   - 3 venues with 6 grounds each (Badminton, Cricket, Tennis)
   - 30-minute time slot intervals
   - Real-time availability (Green: Available, Red: Booked, Yellow: Blocked)
   - Hot selling slot highlights
   - Weekly view calendar

2. **User Dashboard**
   - View booking history
   - Manage profile information
   - Track total bookings and spending
   - Apply discount coupons at checkout

3. **Authentication**
   - Username/Password login
   - Google SSO integration
   - Secure session management

### Admin Features
1. **Admin Dashboard**
   - View all users and bookings
   - Manage discount coupons (Create, Edit, Delete, Activate/Deactivate)
   - Track revenue and statistics
   - User role management

2. **Booking Management**
   - View all bookings with payment status
   - Real-time slot availability control
   - Price management

## Database Schema

### Tables
1. **profiles** - User information and roles
2. **venues** - Sports facility locations
3. **grounds** - Individual courts/fields within venues
4. **time_slots** - Bookable time slots with pricing
5. **bookings** - User booking records
6. **coupons** - Discount coupon management

### Initial Data
- 3 venues pre-configured
- 6 grounds per venue (2 badminton, 2 cricket, 2 tennis)
- Time slots generated for next 7 days (6 AM - 10 PM)
- 3 sample discount coupons

## Getting Started

### First Time Setup
1. The first user to register will automatically become an admin
2. Subsequent users will have regular user role

### Test Credentials
**Note**: These are for reference only. Create your own accounts.
- Regular User: test@user.com / password123
- Admin User: admin@laqshya.com / admin123

### Login Methods
1. **Username/Password**: Enter username (automatically appends @miaoda.com)
2. **Google SSO**: Click "Sign in with Google" button

## User Workflows

### Booking a Slot
1. Navigate to "Book Now" from the header
2. **Step 1**: Select your sport (Badminton, Cricket, or Tennis)
3. **Step 2**: Choose venue, ground, date, and time slot
4. **Step 3**: Review booking, apply discount coupon (optional), and confirm

### Applying Discount Coupons
- View available coupons in the checkout page
- Enter coupon code manually or click on available coupons
- Discount is automatically calculated and applied

### Managing Profile
1. Go to "My Dashboard" after logging in
2. Click "Edit Profile" to update name and phone
3. View booking history and total spending

## Admin Workflows

### Accessing Admin Dashboard
1. Login with admin credentials
2. Click "Admin" button in the header
3. Access admin dashboard at `/admin/dashboard`

### Managing Coupons
1. Go to "Coupons" tab in admin dashboard
2. Click "Create Coupon" to add new discount
3. Configure:
   - Coupon code (uppercase)
   - Discount type (Percentage or Fixed amount)
   - Discount value
   - Minimum amount requirement
   - Usage limit
   - Valid date range
4. Activate/Deactivate or Delete coupons as needed

### Viewing Statistics
- Total users count
- Total bookings count
- Total revenue (completed payments only)
- Active coupons count

## Design System

### Color Scheme
- **Primary**: Vibrant blue (#4A9EFF) - Main brand color
- **Accent**: Neon cyan (#00D9FF) - Interactive elements
- **Secondary**: Dark navy (#1A2332) - Backgrounds
- **Success**: Green - Available slots
- **Warning**: Yellow - Blocked slots
- **Destructive**: Red - Booked slots

### Special Effects
- **Neon Glow**: Applied to primary buttons and active elements
- **Hover Lift**: Cards and interactive elements lift on hover
- **Glass Effect**: Semi-transparent backgrounds with blur
- **Gradient Text**: Brand name and headings
- **Parallax Scrolling**: Background images on landing page

## API Integration Points

### Payment Integration (Razorpay)
Currently using mock payment flow. To integrate real Razorpay:
1. Add Razorpay API keys to environment variables
2. Update booking confirmation to use Razorpay SDK
3. Implement payment verification webhook

### Google Maps
- Coordinates: 17.6887° N, 83.1774° E (Visakhapatnam)
- Embedded iframe for location display

## Environment Variables
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_APP_ID=app-7q9scrugefwh
```

## Security Features
1. **Row Level Security (RLS)** enabled on all tables
2. **Admin-only operations** protected by role checks
3. **Secure authentication** with Supabase Auth
4. **Input validation** on all forms
5. **SQL injection prevention** through Supabase client

## Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), xl (1280px)
- Collapsible navigation on mobile
- Touch-friendly interface elements

## Performance Optimizations
1. Lazy loading of images
2. Efficient database queries with proper indexing
3. Client-side caching of venue and ground data
4. Optimized re-renders with React hooks

## Future Enhancements
1. Real-time slot updates using Supabase subscriptions
2. Email notifications for booking confirmations
3. SMS reminders for upcoming bookings
4. Advanced analytics dashboard for admins
5. Multi-language support
6. Mobile app version
7. Integration with fitness tracking apps
8. Loyalty program and rewards system

## Support
For issues or questions:
- Email: info@laqshya.com
- Phone: +91 XXXX-XXXXXX
- Location: Visakhapatnam, Andhra Pradesh

## License
© 2025 LAQSHYA BADMINTON ACADEMY. All Rights Reserved.
