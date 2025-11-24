# LAQSHYA BADMINTON ACADEMY Sports Booking Website Requirements Document

## 1. Project Overview

### 1.1 Website Name
LAQSHYA BADMINTON ACADEMY\n
### 1.2 Website Description
A comprehensive sports slot booking platform built with React and Vite, enabling users to book sports facilities across multiple venues with real-time availability tracking, user management, and admin controls.

### 1.3 Technology Stack
- Frontend: React + Vite
- Backend: Spring Boot (future integration)
- Authentication: Google OAuth + JWT-based email/password
- Payment: Razorpay integration
- Map: Google Maps API (coordinates: 17.6887° N, 83.1774° E)
\n## 2. Core Features

### 2.1 Landing Page
- Title: 'LAQSHYA BADMINTON ACADEMY' prominently displayed
- Left side: Main content and branding
- Right side: Enlarged sport picture and promotional image (increased size for better visual impact)
- Premium loading screen with 5-6 looping sports action videos/GIFs (badminton players playing shuttle, giving serve, scoring shots, cricket batting, tennis serves, general sports activities)
- Enhanced parallax scrolling with sports-themed background GIFs/images (smooth depth transitions, optimized scroll speed ratios)
- Use provided logo (image_1763433381809_1763544640339.png) as page logo
- Use reference images (image_1763433377815_1763544640338.png, image_1763433372405_1763544640338.png, image.png) for layout guidance

### 2.2 Loading Screens
- Initial page load: Display loading screen with 5-6 sports animation GIFs/videos cycling through different sports activities
- Page transitions: Show loading screen when clicking 'Book Now' or navigating between major sections
- Loading animations include: badminton smashes, cricket shots, tennis serves, general athletic movements, sports equipment animations
- Smooth fade-in/fade-out transitions for loading screens

### 2.3 Theme Toggle Feature
- Theme toggle button positioned in the header/navigation bar
- Two theme modes: Light Mode and Dark Mode
- Theme synchronization across all pages and components
- Persistent theme preference stored in local storage
- Smooth transition animations when switching themes
- Theme-aware color adjustments for all UI elements (backgrounds, text, cards, buttons)

### 2.4 Venue and Ground Booking System
- 3 venues available\n- Each venue contains 6 grounds per sport (Badminton: 6 grounds, Cricket: 6 grounds, Tennis: 6 grounds)
- Rectangular selection layout as shown in reference image
- 30-minute slot intervals\n- Weekly view span\n- Live court availability status:\n  * Green: Available
  * Red: Not Available
  * Yellow: Blocked/In Progress
- Hot selling feature: Highlight one slot as 'best-booked'\n\n### 2.5 Sports Selection
- Responsive carousel with 3 sports cards\n- Sports offered: Badminton, Cricket, Tennis
- Each sport button fully functional and navigable
- Exclude swimming from options
\n### 2.6 Booking Process (3 Steps)
- Step 1: Select Your Sport (with info description)
- Step 2: Select Your Slot (with info description)
- Step 3: Make Payment (with info description)
\n### 2.7 Health Benefits Section
- Improved Fitness\n- Better Focus
- Cultivates Discipline
- Strength Training
- Cool Down\n- Include vibrant images for each benefit

### 2.8 Amenities Section
- Plenty of Parking
- Pleasant Environment (no pollution)
- Professional Trainers
- Soft Drinks
- Waiting Area
- Sports Library
- Space allocated for custom images for each amenity card

### 2.9 Contact and Location
- Contact form integration
- Google Maps integration with coordinates: 17.6887° N, 83.1774° E\n\n### 2.10 Footer
- 'Never Miss Any Updates' subscription section
- Copyright information
- All legal disclaimers
\n## 3. Authentication System

### 3.1 User Authentication
- Google OAuth social login (emergent-based)
- JWT-based custom email/password authentication
- Frontend paths prepared for backend integration
- Login/Sign-up validation warnings:\n  * Display error messages for invalid email format
  * Display warning for incorrect password
  * Display warning for empty required fields
  * Display success message upon successful login/registration
  * Display warning if user already exists during sign-up
- Dummy login credentials for testing:\n  * User: test@user.com / password123
\n### 3.2 Admin Authentication
- Separate admin login portal
- Admin login validation warnings:
  * Display error messages for invalid credentials
  * Display warning for unauthorized access attempts
  * Display success message upon successful admin login
- Dummy admin credentials for testing:
  * Admin: admin@laqshya.com / admin123

### 3.3 Pre-Login Payment Protection
- If user attempts to proceed to payment without logging in, display error message:'Please log in to continue with your booking'
- Redirect user to login page\n- After successful login, return user to booking flow at the same step
\n## 4. User Features (Post-Login)

### 4.1 User Activity Tab
- Display previous booking history
- User profile customization:\n  * Change user information
  * Update payment methods (Razorpay linked)
\n### 4.2 Checkout and Discounts
- Discount coupons section visible at checkout
- Display all available discounts
- Apply coupon functionality
\n## 5. Payment System

### 5.1 Payment Flow
- Pre-login validation: Block payment attempts for non-logged-in users with error prompt
- Post-login payment process:
  * Razorpay integration (frontend paths prepared)
  * Mock payment flow for testing phase
\n### 5.2 Payment Success Page (Dummy)
- Display after successful payment (even without real gateway)
- Components:
  * Payment success confirmation message
  * Generated QR code for booking reference
  * Slot booking details:\n    - Venue name
    - Sport type
    - Ground number
    - Date and time slot
    - Booking ID\n    - Amount paid
  * Download/Share booking confirmation option
  * Return to home button

## 6. Admin Dashboard

### 6.1 Admin Functionalities
- User management (view, edit, delete users)
- Price management (update slot prices)
- Discount coupon management (create, edit, delete coupons)
- Booking overview and management
- Venue and ground management
- Real-time availability control
\n## 7. Design Specifications

### 7.1 Design Style
- Color Scheme: Vibrant black and blue theme with neon accents for interactive elements (Light Mode: bright blue #0066FF with white backgrounds; Dark Mode: deep navy #001F3F with dark backgrounds)
- Background: Dynamic GIFs/videos supporting enhanced parallax scrolling effect with optimized layer depth, sports-themed imagery\n- Layout: Modern card-based design with clear visual hierarchy, enlarged hero section images for stronger visual impact
- Navigation: Sleek modern navigation bar with smooth transitions and integrated theme toggle button
- Interactive Elements: Hover effects on all clickable components, smooth animations on state changes, theme-aware color transitions
- Visual Effects: Enhanced parallax scrolling throughout the page with multiple depth layers, premium loading animations with5-6 sports action sequences
- Typography: Bold headers with clean sans-serif fonts for readability, theme-adaptive text colors
- Spacing: Generous whitespace between sections for visual breathing room\n
### 7.2 Component Structure
- Separate components: Header, Body, Footer\n- Modular architecture compatible with Spring Boot backend
- Clear folder structure for frontend-backend integration
\n## 8. Technical Requirements

### 8.1 Frontend Features
- Enhanced parallax scrolling with multiple depth layers and optimized scroll speed ratios (mandatory feature)
- Theme toggle functionality with persistent storage and synchronized theme across all components
- Multiple loading screens:\n  * Initial page load with 5-6 sports animations
  * Page transition loading screens (e.g., clicking 'Book Now')
  * Smooth animation cycling through different sports activities
- Hover effects on interactive elements
- Responsive design across all devices
- All features fully functional with mock data
- Customizable loading screen code
- Stock sports action videos/GIFs for loading screens (5-6 different animations)
- Login/Sign-up validation warnings and error handling
- Pre-login payment blocking with error messages

### 8.2 Backend Preparation
- Component naming compatible with Spring Boot conventions
- Folder structure organized for backend integration
- Spring Boot API documentation file included
- API endpoint paths defined for:\n  * Authentication (Google OAuth + JWT)
  * Booking management
  * Payment processing (Razorpay)\n  * User management
  * Admin operations
  * Discount coupon system
\n### 8.3 Navigation\n- All components navigable\n- Every button functional
- Smooth transitions between sections with loading screens
\n### 8.4 Testing and Quality Assurance
- Complete application testing with dummy credentials:\n  * User credentials: test@user.com / password123
  * Admin credentials: admin@laqshya.com / admin123
- Test all authentication flows (login, sign-up, logout)
- Test pre-login payment blocking and error messages
- Test dummy payment success page with QR code generation
- Test theme toggle functionality across all pages
- Test parallax scrolling performance and visual effects
- Test loading screens on initial load and page transitions
- Test booking flow from sport selection to payment
- Verify 6 grounds per sport per venue configuration
- Test admin dashboard functionalities
- Identify and fix any errors, bugs, or UI inconsistencies
- Verify responsive design on multiple devices and screen sizes
- Validate all form inputs and error handling
- Test navigation and routing between all pages
\n## 9. Reference Images
- Logo: image_1763433381809_1763544640339.png (use as page logo)
- Layout Reference: image_1763433377815_1763544640338.png\n- Design Reference: image_1763433372405_1763544640338.png
- Additional Reference: image.png\n
## 10. Future Enhancements
- Spring Boot backend integration\n- Real payment gateway activation
- Custom video uploads for loading screen
- Additional sports options\n- Advanced booking analytics