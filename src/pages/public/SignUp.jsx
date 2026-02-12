/**
 * @fileoverview SignUp component.
 * Allows users to register via email/password or OAuth providers.
 * Syncs user data and role after successful authentication.
 *
 * @module pages/public/SignUp
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Divider,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import FormCard from '../../components/FormCard.jsx';
import Input from '../../components/Input.jsx';
import AuthProviderButton from '../../components/AuthProviderButton.jsx';
import { auth } from '../../firebase/auth.js';
import { useUser } from '../../hooks/useUser.jsx';

import {
  signInWithRedirect,
  getRedirectResult,
} from '../../firebase/authUtils.js';
import { googleProvider, githubProvider } from '../../firebase/auth.js';

import {
  createUserWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getRedirectForRole } from '../../utils/getRedirectForRole.js';

/**
 * SignUp component.
 * Provides registration via email/password or social providers (Google, GitHub).
 * Handles authentication flow, user sync, and redirects.
 *
 * @function SignUp
 * @returns {JSX.Element} Sign-up page layout
 */
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, loading: userLoading } = useUser();

  const fromPath = location.state?.from?.pathname;

  useEffect(() => {
    const authPages = ['/sign-in', '/register'];
    const currentPath = location.pathname;

    if (isAuthenticated && !userLoading && authPages.includes(currentPath)) {
      const fallbackPath = getRedirectForRole(role);
      navigate(fromPath || fallbackPath);
    }
  }, [isAuthenticated, userLoading, role, navigate, fromPath, location.pathname]);

  /**
   * Handles authentication flow after Firebase login/registration.
   * @param {object} firebaseUser - Firebase user object
   * @param {string|null} customRedirectPath - Optional custom redirect path
   */
  const handleAuthFlow = async (firebaseUser, customRedirectPath = null) => {
    try {
      const token = await firebaseUser.getIdToken(true);
      localStorage.setItem('token', token);

      let userData;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_EXPRESS_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        userData = res.data;
      } catch (err) {
        if (err.response?.status === 404) {
          const registerRes = await axios.post(
            `${import.meta.env.VITE_EXPRESS_URL}/register`,
            {
              idToken: token,
              username: firebaseUser.displayName || firebaseUser.email,
              invitationCode: null,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          userData = { role: registerRes.data.role };
        } else {
          setError('Authentication failed');
          return;
        }
      }

      const redirectPath =
        customRedirectPath || fromPath || getRedirectForRole(userData.role);
      navigate(redirectPath, { replace: true });
    } catch {
      setError('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          const storedPath = localStorage.getItem('redirectAfterLogin');
          localStorage.removeItem('redirectAfterLogin');
          await handleAuthFlow(result.user, storedPath);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError(`Provider registration error: ${err.message}`);
        setLoading(false);
      }
    };

    checkRedirectResult();
  }, []);

  /**
   * Handles OAuth sign-up via Google or GitHub.
   * @param {string} providerName - The provider to use ("google" or "github").
   */
  const handleSocialRedirect = async (providerName) => {
    setError('');
    setIsSubmitting(true);

    const provider = providerName === 'google' ? googleProvider : githubProvider;

    try {
      await setPersistence(auth, browserLocalPersistence);

      if (fromPath) {
        localStorage.setItem('redirectAfterLogin', fromPath);
      }

      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError(`Failed to register with ${providerName}: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  /**
   * Handles email/password registration.
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    if (!email || !password || !confirm) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirm) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await handleAuthFlow(result.user);
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters');
          break;
        default:
          setError('Something went wrong, please try again');
      }
      setIsSubmitting(false);
    }
  };

  if (loading || userLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading authentication...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <FormCard
          title="Create your account"
          subtitle="Access your workspace in seconds."
          loading={isSubmitting}
          footer={
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Link
                to="/sign-in"
                style={{ color: '#90caf9', textDecoration: 'none' }}
              >
                Sign In
              </Link>
            </Typography>
          }
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <AuthProviderButton
            provider="google"
            onClick={() => handleSocialRedirect('google')}
          />
          <AuthProviderButton
            provider="github"
            onClick={() => handleSocialRedirect('github')}
          />

          <Divider sx={{ my: 2 }}>or create with email</Divider>

          <Input
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !email}
            helperText={!email && error ? 'Email is required' : ''}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error && !password}
            helperText={!password && error ? 'Password is required' : ''}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={!!error && password !== confirm}
            helperText={password !== confirm ? 'Passwords do not match' : ''}
          />

          <Button
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </Button>
        </FormCard>
      </Container>
    </Box>
  );
};

export default SignUp;
