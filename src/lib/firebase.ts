// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  type User
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  setLogLevel,
  doc,
  getDocFromServer,
  type Firestore
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Your web app's Firebase configuration
// Uses the provisioned AI Studio Firestore database ID
const firebaseConfig = {
  apiKey: firebaseAppletConfig.apiKey || "AIzaSyByvLEnS_aDcsOxzhTrGPxNRAjK5WYQWx0",
  authDomain: firebaseAppletConfig.authDomain || "food-specialist-3e294.firebaseapp.com",
  projectId: firebaseAppletConfig.projectId || "food-specialist-3e294",
  storageBucket: firebaseAppletConfig.storageBucket || "food-specialist-3e294.firebasestorage.app",
  messagingSenderId: firebaseAppletConfig.messagingSenderId || "198607039485",
  appId: firebaseAppletConfig.appId || "1:198607039485:web:0ca78b0fa191d6f35c4794",
  measurementId: firebaseAppletConfig.measurementId || "G-4MR4S86VQS",
  firestoreDatabaseId:
    firebaseAppletConfig.firestoreDatabaseId ||
    "ai-studio-foodspecialists-35276f34-d7c0-4ee2-a240-91a0957cf049"
};

// Silence noisy internal @firebase/firestore WebChannel 10s timeout logs
setLogLevel('silent');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics =
  typeof window !== 'undefined'
    ? isSupported()
        .then((yes) => (yes ? getAnalytics(app) : null))
        .catch(() => null)
    : null;

export const auth = getAuth(app);

// Connect explicitly to the provisioned named Firestore database using HTTP long-polling
// to avoid WebChannel streaming 10s timeouts inside iframes / mobile proxies
function createFirestoreInstance(): Firestore {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createFirestoreInstance();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Validate connection to Firestore at startup without crashing on transient offline states
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.warn('Firestore connection check: operating in offline/cached fallback mode.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: boolean | string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): void {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errCode = (error as { code?: string })?.code || '';

  // Ignore transient offline / network unavailability so the UI gracefully falls back to local state
  if (
    errCode === 'unavailable' ||
    errMsg.includes('the client is offline') ||
    errMsg.includes('Could not reach Cloud Firestore backend')
  ) {
    console.warn(`Firestore transient network state (${operationType} on ${path}):`, errMsg);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  type User
};
