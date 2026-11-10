import React, { useState, useEffect } from 'react';
import {
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
  updateProfile,
  savePersistedAuthUser
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
    return 'Sign-in popup request was cancelled. Please click Login with Google again.';
  }
  if (code === 'auth/popup-blocked' || raw.includes('auth/popup-blocked')) {
    return 'Popup was blocked by your browser. Redirecting to Google Sign-In...';
  }
  if (
    code === 'auth/unauthorized-domain' ||
    raw.includes('auth/unauthorized-domain')
  ) {
    return 'Domain authorization pending in Firebase Console. Please use Email/Password or authorize the domain in Firebase Auth settings.';
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
    getRedirectResult(auth)
      .then((res) => {
        if (res?.user) {
          savePersistedAuthUser(res.user);
        }
      })
      .catch((err) => {
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
    setResetSuccessMessage(null);
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
        'Please enter your Email Address first, then tap "Forgot Password?".'
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setResetSuccessMessage(
        `Password reset link sent to ${trimmedEmail}. Please check your inbox.`
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
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred?.user) {
        savePersistedAuthUser(cred.user);
      }
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
        savePersistedAuthUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: trimmedName,
          photoURL: userCredential.user.photoURL,
          emailVerified: userCredential.user.emailVerified
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );
        savePersistedAuthUser(userCredential.user);
      }
    } catch (err) {
      setErrorMessage(getFriendlyFirebaseAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#091326] via-[#0F2547] to-[#1673B8] text-[#1A2138] flex flex-col items-center justify-center px-4 py-8">
      {/* Subtle Ambient Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-[#38BDF8]/20 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-[320px] h-[320px] rounded-full bg-[#1673B8]/30 blur-[100px]"
      />

      <div className="relative z-10 w-full max-w-[390px] flex flex-col items-center">
        {/* Top-Mid Centered Brand Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-24 h-24 rounded-[28px] bg-white shadow-[0_14px_38px_rgba(0,0,0,0.32)] ring-4 ring-white/15 flex items-center justify-center overflow-hidden mb-3.5">
            <img
              src={FS_PORTAL_LOGO_DATA_URI}
              alt="Foodifyy Logo"
              className="w-full h-full object-cover select-none"
            />
          </div>
          <h1 className="text-[26px] font-black tracking-tight text-white leading-none">
            Foodi<span className="text-[#38BDF8]">fyy</span>
          </h1>
          <p className="text-xs font-medium text-sky-100/80 mt-1.5">
            {mode === 'signin'
              ? 'Welcome back! Sign in to continue'
              : 'Create your specialist account'}
          </p>
        </div>

        {/* Sleek Minimal Auth Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/40 shadow-[0_24px_60px_rgba(5,15,35,0.45)] p-6 sm:p-7 space-y-4">
          {/* Error Message Box */}
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold space-y-2"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
              {isUnauthorizedDomainError && (
                <div className="pt-2 border-t border-red-200/80 space-y-2 text-[11px] text-red-900">
                  <div className="flex items-center justify-between gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-red-200">
                    <code className="font-mono font-bold text-gray-800 truncate">
                      {currentDomain}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyDomain}
                      className="px-2.5 py-1 rounded-lg bg-[#1673B8] text-white font-bold text-[10.5px] shrink-0 cursor-pointer"
                    >
                      {copiedDomain ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reset Password Success Box */}
          {resetSuccessMessage && (
            <div className="p-3 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE] text-[#1A2138] text-xs font-semibold">
              {resetSuccessMessage}
            </div>
          )}

          {/* 1. Email & Password Form First */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            {mode === 'signup' && (
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-fullname"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1673B8] focus:ring-2 focus:ring-[#1673B8]/15 transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1673B8] focus:ring-2 focus:ring-[#1673B8]/15 transition-all"
              />
            </div>

            <div className="space-y-1.5">
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
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1673B8] focus:ring-2 focus:ring-[#1673B8]/15 transition-all"
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

              {mode === 'signin' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11.5px] font-bold text-[#1673B8] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] text-sm font-medium text-[#1A2138] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#1673B8] focus:ring-2 focus:ring-[#1673B8]/15 transition-all"
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
            )}

            <button
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#1673B8] to-[#0F4C81] hover:from-[#12629E] hover:to-[#0B3B66] disabled:opacity-65 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(22,115,184,0.32)] transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Login' : 'Sign Up'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Subtle Divider */}
          <div className="relative flex items-center justify-center py-0.5">
            <div className="border-t border-[#E2ECF5] w-full" />
            <span className="bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              or
            </span>
            <div className="border-t border-[#E2ECF5] w-full" />
          </div>

          {/* 2. Login with Google Option Below */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full py-3 px-4 rounded-2xl bg-[#F8FAFC] hover:bg-[#EBF4FC] border border-[#D2DEEA] hover:border-[#1673B8] disabled:opacity-60 text-[#1A2138] font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
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
                    ? 'Login with Google'
                    : 'Sign up with Google'}
                </span>
              </>
            )}
          </button>

          {/* 3. Small Sign Up / Sign In Option at the Bottom */}
          <div className="pt-2 border-t border-[#EEF4FA] text-center">
            {mode === 'signin' ? (
              <p className="text-xs text-[#5A6C84] font-medium">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="font-extrabold text-[#1673B8] hover:underline cursor-pointer ml-0.5"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#5A6C84] font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="font-extrabold text-[#1673B8] hover:underline cursor-pointer ml-0.5"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Subtle Legal Links Footer */}
        <div className="mt-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[11px] font-semibold text-sky-200/75">
            <button
              type="button"
              onClick={() => setLegalModalTab('privacy')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-sky-300/40">•</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('terms')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-sky-300/40">•</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('ads')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              AdMob Policy
            </button>
            <span className="text-sky-300/40">•</span>
            <button
              type="button"
              onClick={() => setLegalModalTab('deletion')}
              className="hover:text-white hover:underline cursor-pointer"
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
