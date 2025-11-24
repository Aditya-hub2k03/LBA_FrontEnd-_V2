import type { ReactNode } from 'react';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Venues from './pages/Venues';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />,
    visible: true,
  },
  {
    name: 'Book Now',
    path: '/booking',
    element: <Booking />,
    visible: true,
  },
  {
    name: 'Venues',
    path: '/venues',
    element: <Venues />,
    visible: true,
  },
  {
    name: 'My Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
    visible: false,
  },
  {
    name: 'Payment Success',
    path: '/payment-success',
    element: <PaymentSuccess />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLogin />,
    visible: false,
  },
  {
    name: 'Admin Dashboard',
    path: '/admin/dashboard',
    element: <AdminDashboard />,
    visible: false,
  },
];

export default routes;