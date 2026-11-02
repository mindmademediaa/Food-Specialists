import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Leaf
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from '../lib/firebase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GoogleLogoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"
    />
  </svg>
);

function getFriendlyFirebaseAuthError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  const code = (err as { code?: string })?.code || '';

  if (
    code === 'auth/popup-closed-by-user' ||
    raw.includes('auth/popup-closed-by-user')
  ) {
    return 'Google sign-in popup was closed before completing. Please try again.';
  }
  if (
    code === 'auth/cancelled-popup-request' ||
    raw.includes('auth/cancelled-popup-request')
  ) {
    return 'Sign-in popup request was cancelled. Please click Sign in with Google again.';
  }
  if (code === 'auth/popup-blocked' || raw.includes('auth/popup-blocked')) {
    return 'Popup was blocked by your browser. Redirecting to Google Sign-In...';
  }
  if (
    code === 'auth/unauthorized-domain' ||
    raw.includes('auth/unauthorized-domain')
  ) {
    return 'Domain authorization pending in Firebase Console (mindmademediaa.github.io). Please use Email/Password or authorize the domain in Firebase Auth settings.';
  }
  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    raw.includes('auth/invalid-credential') ||
    raw.includes('auth/wrong-password') ||
    raw.includes('auth/user-not-found')
  ) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (
    code === 'auth/email-already-in-use' ||
    raw.includes('auth/email-already-in-use')
  ) {
    return 'An account with this email address already exists. Please switch to Sign In.';
  }
  if (code === 'auth/invalid-email' || raw.includes('auth/invalid-email')) {
    return 'Please enter a valid email address (e.g., specialist@domain.com).';
  }
  if (code === 'auth/weak-password' || raw.includes('auth/weak-password')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (
    code === 'auth/too-many-requests' ||
    raw.includes('auth/too-many-requests')
  ) {
    return 'Too many failed attempts. Please wait a moment before trying again.';
  }
  if (
    code === 'auth/network-request-failed' ||
    raw.includes('auth/network-request-failed')
  ) {
    return 'Network error. Please check your internet connection and try again.';
  }
  return 'Authentication failed. Please verify your details and try again.';
}

export const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getRedirectResult(auth).catch((err) => {
      if (active && err) {
        setErrorMessage(getFriendlyFirebaseAuthError(err));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const switchMode = (nextMode: 'signin' | 'signup') => {
    setMode(nextMode);
    setErrorMessage(null);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      const raw = err instanceof Error ? err.message : String(err);
      if (
        code === 'auth/popup-blocked' ||
        raw.includes('auth/popup-blocked') ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          setErrorMessage(getFriendlyFirebaseAuthError(redirectErr));
        }
      } else {
        setErrorMessage(getFriendlyFirebaseAuthError(err));
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    if (mode === 'signup' && trimmedName.length < 2) {
      setErrorMessage('Please enter your full name (at least 2 characters).');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please confirm your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );
        await updateProfile(userCredential.user, {
          displayName: trimmedName
        });
      } else {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
      }
    } catch (err) {
      setErrorMessage(getFriendlyFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-gray-900 flex flex-col items-center justify-center py-6 px-4">
      <div className="w-full max-w-[440px] bg-[#EEF7F0] rounded-[34px] border-[1.5px] border-[#9EC4A7] shadow-xl overflow-hidden p-5 sm:p-6 space-y-5">
        {/* Top Green Branding Banner */}
        <div className="bg-[#16A34A] text-white rounded-[24px] p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[10.5px] font-extrabold uppercase tracking-wider">
                <Leaf className="w-3 h-3" />
                <span>Food Specialists Portal</span>
              </div>
              <h1 className="text-[23px] font-extrabold tracking-tight leading-tight mt-0.5">
                Food Careers &amp; Safety Hub
              </h1>
            </div>
          </div>
          <p className="text-xs text-emerald-50 font-medium mt-2.5 leading-relaxed">
            Sign in to access Food Science &amp; QA/QC jobs, international scholarships, accredited trainings, and the Specialist Directory.
          </p>
        </div>

        {/* Mode Switcher Tabs: Sign In / Sign Up */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#D8ECD9] p-1.5 rounded-[20px] border border-[#B5D6BB]">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`py-2.5 rounded-[15px] text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-[#0D2E1B] hover:bg-white/50'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-2.5 rounded-[15px] text-xs font-extrabold transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#15803D] text-white shadow-xs'
                : 'text-[#0D2E1B] hover:bg-white/50'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Auth Form Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-[#B8D3BE] rounded-[26px] p-5 shadow-[0_6px_24px_rgba(22,163,74,0.07)] space-y-4"
        >
          <div>
            <h2 className="text-[20px] font-extrabold text-[#0D2E1B]">
              {mode === 'signin'
                ? 'Welcome Back, Specialist'
                : 'Create Your Specialist Account'}
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {mode === 'signin'
                ? 'Sign in with Google or enter your registered email'
                : 'Sign up quickly with Google or register with your email'}
            </p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* SIGN IN WITH GOOGLE BUTTON */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full py-3.5 px-4 rounded-[18px] bg-white hover:bg-[#F2F7F3] border-2 border-[#9EC4A7] hover:border-[#16A34A] disabled:opacity-60 text-[#0D2E1B] font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
          >
            {isGoogleSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 text-[#15803D] animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <GoogleLogoIcon />
                <span>
                  {mode === 'signin'
                    ? 'Sign in with Google'
                    : 'Sign up with Google'}
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-0.5">
            <div className="border-t border-emerald-100 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
              or continue with email
            </span>
            <div className="border-t border-emerald-100 w-full" />
          </div>

          {/* Full Name (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-fullname"
                className="block text-xs font-extrabold text-[#0D2E1B]"
              >
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#15803D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-fullname"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Muneeb Khan"
                  className="w-full pl-10 pr-4 py-3 rounded-[16px] bg-[#F2F7F3] border border-[#AECBB5] text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A]"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="auth-email"
              className="block text-xs font-extrabold text-[#0D2E1B]"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#15803D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="specialist@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-[16px] bg-[#F2F7F3] border border-[#AECBB5] text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="auth-password"
              className="block text-xs font-extrabold text-[#0D2E1B]"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#15803D] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-10 py-3 rounded-[16px] bg-[#F2F7F3] border border-[#AECBB5] text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0D2E1B] p-1 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password (Sign Up only) */}
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-confirm-password"
                className="block text-xs font-extrabold text-[#0D2E1B]"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#15803D] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-10 py-3 rounded-[16px] bg-[#F2F7F3] border border-[#AECBB5] text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? 'Hide confirm password'
                      : 'Show confirm password'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0D2E1B] p-1 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full py-3.5 px-5 rounded-[18px] bg-[#15803D] hover:bg-[#0D2E1B] disabled:opacity-65 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {mode === 'signin'
                    ? 'Signing In...'
                    : 'Creating Specialist Account...'}
                </span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'signin' ? 'Sign In with Email' : 'Create Account'}
                </span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>

          {/* Toggle Mode Footer */}
          <div className="pt-2 border-t border-emerald-100 text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-gray-600 font-medium">
                Don&apos;t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-extrabold text-[#15803D] hover:underline cursor-pointer"
                >
                  Sign Up Now
                </button>
              </p>
            ) : (
              <p className="text-xs text-gray-600 font-medium">
                Already have a registered account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-extrabold text-[#15803D] hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </form>

        {/* Footer Branding */}
        <div className="text-center pt-1">
          <p className="text-[11px] font-semibold text-[#14532D]">
            Developed by Muneeb Khan, Food Safety Specialist, +923240906384
          </p>
        </div>
      </div>
    </div>
  );
};
