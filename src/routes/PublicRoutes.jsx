import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser.jsx';

/**
 * @fileoverview PublicRoutes configuration.
 * Defines public routes accessible without authentication.
 * Includes marketing pages, documentation, onboarding flows, and authentication pages.
 * Routes like `/sign-in` and `/register` are wrapped with `AuthRedirect` to prevent access by logged-in users.
 *
 * @module routes/PublicRoutes
 */

// 📄 Public pages (lazy-loaded for performance optimization)
const Home = lazy(() => import('../pages/public/Home'));
const Features = lazy(() => import('../pages/public/Features'));
const Blog = lazy(() => import('../pages/public/Blog'));
const SignIn = lazy(() => import('../pages/public/SignIn'));
const SignUp = lazy(() => import('../pages/public/SignUp'));
const ContactSupport = lazy(() => import('../pages/public/ContactSupport'));
const Testimonials = lazy(() => import('../pages/public/Testimonials'));
const ForDevelopers = lazy(() => import('../pages/public/ForDevelopers'));
const AIAssistant = lazy(() => import('../pages/public/AIAssistant'));
const PrivacyPolicy = lazy(() => import('../pages/public/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/public/TermsOfService'));
const HelpCenter = lazy(() => import('../pages/public/HelpCenter'));

/**
 * AuthRedirect Component
 *
 * Prevents authenticated users from accessing public auth pages.
 * If the user is authenticated, it redirects to the dashboard.
 * Otherwise, it renders the intended child component.
 *
 * @function AuthRedirect
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The component to render if unauthenticated.
 * @returns {JSX.Element|null} Redirect or child component.
 *
 * @example
 * <AuthRedirect>
 *   <SignIn />
 * </AuthRedirect>
 */
const AuthRedirect = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

/**
 * PublicRoutes
 *
 * @constant
 * @type {RouteObject[]}
 * @description Route configuration for public pages accessible without authentication.
 *
 * @example
 * import { PublicRoutes } from './routes/PublicRoutes';
 *
 * <Routes>
 *   {PublicRoutes.map((route, idx) => (
 *     <Route key={idx} path={route.path} element={route.element} />
 *   ))}
 * </Routes>
 */
export const PublicRoutes = [
  { index: true, element: <Home /> },
  { path: 'home', element: <Home /> },
  { path: 'features', element: <Features /> },
  { path: 'blog', element: <Blog /> },
  {
    path: 'sign-in',
    element: (
      <AuthRedirect>
        <SignIn />
      </AuthRedirect>
    ),
  },
  {
    path: 'register',
    element: (
      <AuthRedirect>
        <SignUp />
      </AuthRedirect>
    ),
  },
  { path: 'contact', element: <ContactSupport /> },
  { path: 'testimonials', element: <Testimonials /> },
  { path: 'developers', element: <ForDevelopers /> },
  { path: 'ai', element: <AIAssistant /> },
  { path: 'privacy', element: <PrivacyPolicy /> },
  { path: 'terms', element: <TermsOfService /> },
  { path: 'help', element: <HelpCenter /> },
];
