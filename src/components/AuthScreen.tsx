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
  Loader2
} from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from '../lib/firebase';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import {
  LegalComplianceModal,
  LegalTabType
} from './LegalComplianceModal';

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
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(
    null
  );
  const [isUnauthorizedDomainError, setIsUnauthorizedDomainError] =
    useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType | null>(null);

  const currentDomain =
    typeof window !== 'undefined' && window.location.hostname
      ? window.location.hostname
      : 'mindmademediaa.github.io';

  useEffect(() => {
    let active = true;
    getRedirectResult(auth).catch((err) => {
      if (active && err) {
        const code = (err as { code?: string })?.code || '';
        const raw = err instanceof Error ? err.message : String(err);
        if (
          code === 'auth/unauthorized-domain' ||
          raw.includes('auth/unauthorized-domain')
        ) {
          setIsUnauthorizedDomainError(true);
        }
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
    setIsUnauthorizedDomainError(false);
  };

  const handleCopyDomain = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentDomain);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    }
  };

  const handleForgotPassword = async () => {
    setErrorMessage(null);
    setResetSuccessMessage(null);
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrorMessage(
        'Please enter your Email Address above first, then click "Forgot Password?".'
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setResetSuccessMessage(
        `Password reset link has been sent to ${trimmedEmail}. Please check your Gmail Inbox / Spam folder.`
      );
    } catch (err) {
      setErrorMessage(getFriendlyFirebaseAuthError(err));
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsUnauthorizedDomainError(false);
    setIsGoogleSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const code = (err as { code?: string })?.code || '';
      const raw = err instanceof Error ? err.message : String(err);
      if (
        code === 'auth/unauthorized-domain' ||
        raw.includes('auth/unauthorized-domain')
      ) {
        setIsUnauthorizedDomainError(true);
      }
      if (
        code === 'auth/popup-blocked' ||
        raw.includes('auth/popup-blocked') ||
        code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          const rCode = (redirectErr as { code?: string })?.code || '';
          const rRaw =
            redirectErr instanceof Error
              ? redirectErr.message
              : String(redirectErr);
          if (
            rCode === 'auth/unauthorized-domain' ||
            rRaw.includes('auth/unauthorized-domain')
          ) {
            setIsUnauthorizedDomainError(true);
          }
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
    setIsUnauthorizedDomainError(false);

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
    <div className="min-h-screen bg-[#F0F6FC] text-[#1A2138] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[420px] space-y-4">
        {/* Main Clean Auth Card */}
        <div className="bg-white rounded-[28px] border border-[#D2DEEA] shadow-[0_16px_50px_rgba(22,115,184,0.10)] p-6 sm:p-7 space-y-5">
          {/* Top Brand & Icon Header */}
          <div className="flex flex-col items-center text-center space-y-2.5">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EBF4FC] border border-[#BBD6EE] text-[#1673B8]">
              <div className="w-8 h-8 rounded-full bg-white border border-[#D2DEEA] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                <img
                  src={FS_PORTAL_LOGO_DATA_URI}
                  alt="FS Portal"
                  className="w-full h-full object-contain scale-[1.85] transform-gpu select-none"
                />
              </div>
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#1A2138]">
                FS Port<span className="text-[#1673B8] underline decoration-[#1673B8] decoration-2 underline-offset-2">al</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#1A2138] tracking-tight">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h1>
              <p className="text-xs text-[#5A6C84] font-medium mt-1">
                {mode === 'signin'
                  ? 'Sign in to access your specialist account'
                  : 'Register to unlock jobs, scholarships & directory'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#F0F6FC] rounded-2xl border border-[#D2DEEA]">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#1673B8] text-white shadow-xs font-extrabold'
                  : 'text-[#5A6C84] hover:text-[#1A2138]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#1673B8] text-white shadow-xs font-extrabold'
                  : 'text-[#5A6C84] hover:text-[#1A2138]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold space-y-2.5"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              {isUnauthorizedDomainError && (
                <div className="pt-2 border-t border-red-200/80 space-y-2 text-[11px] text-red-900">
                  <p className="font-bold">
                    1-Minute Fix in Firebase Console (One-Time Only):
                  </p>
                  <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-red-200">
                    <code className="font-mono font-bold text-gray-800 truncate">
                      {currentDomain}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="px-2.5 py-1 rounded-lg bg-[#1673B8] text-white font-bold text-[10.5px] shrink-0 cursor-pointer"
                    >
                      {copiedDomain ? 'Copied!' : 'Copy Domain'}
                    </button>
                  </div>
                  <a
                    href="https://console.firebase.google.com/project/food-specialist-3e294/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 px-3 rounded-xl bg-red-100 hover:bg-red-200/80 text-red-900 font-extrabold underline"
                  >
                    Open Firebase Auth Settings &rarr; Add Domain
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Reset Password Success Box */}
          {resetSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE] text-[#1A2138] text-xs font-semibold">
              {resetSuccessMessage}
            </div>
          )}

          {/* Sign In / Sign Up Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSubmitting || isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] hover:border-[#1673B8] disabled:opacity-60 text-[#1A2138] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
            >
              {isGoogleSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#1673B8] animate-spin" />
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
              <div className="border-t border-[#D2DEEA] w-full" />
              <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#5A6C84] shrink-0">
                or continue with email
              </span>
              <div className="border-t border-[#D2DEEA] w-full" />
            </div>

            {/* Full Name (Sign Up only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label
                  htmlFor="auth-fullname"
                  className="block text-xs font-bold text-[#1A2138]"
                >
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-fullname"
                    type="text"
                    autoComplete="name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Muneeb Khan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1673B8] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="auth-email"
                className="block text-xs font-bold text-[#1A2138]"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="specialist@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1673B8] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-bold text-[#1A2138]"
                >
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1673B8] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6C84] hover:text-[#1A2138] p-1 cursor-pointer"
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
                  className="block text-xs font-bold text-[#1A2138]"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1673B8] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A6C84] hover:text-[#1A2138] p-1 cursor-pointer"
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
              className="w-full py-3 px-5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-65 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
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
            <div className="pt-2 border-t border-[#E4EDF7] text-center">
              {mode === 'signin' ? (
                <p className="text-xs text-[#5A6C84] font-medium">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className="font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                  >
                    Sign Up Now
                  </button>
                </p>
              ) : (
                <p className="text-xs text-[#5A6C84] font-medium">
                  Already have a registered account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className="font-extrabold text-[#1673B8] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer Legal Links (Google Play, AdSense & AdMob Compliant) */}
        <div className="text-center space-y-1.5">
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] font-bold text-[#1673B8]">
            <button
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[#94A3B8]">•</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('terms')}
              className="hover:underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-[#94A3B8]">•</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('ads')}
              className="hover:underline cursor-pointer"
            >
              AdMob Policy
            </button>
            <span className="text-[#94A3B8]">•</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('deletion')}
              className="hover:underline cursor-pointer"
            >
              Data Deletion
            </button>
          </div>
        </div>
      </div>

      <LegalComplianceModal
        isOpen={legalModalTab !== null}
        initialTab={legalModalTab || 'privacy'}
        onClose={() => setLegalModalTab(null)}
      />
    </div>
  );
};
