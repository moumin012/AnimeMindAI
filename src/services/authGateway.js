import { initializeApp, getApps } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, OAuthProvider,
  sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword,
  signInWithPopup, signOut,
} from 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const identityConfigured = Object.values(config).every(Boolean);

function auth() {
  if (!identityConfigured) throw new Error('Identity is not configured. Add public Firebase settings before showing a sign-in form.');
  const app = getApps().length ? getApps()[0] : initializeApp(config);
  return getAuth(app);
}

/** Official Firebase methods. UI must call these only after identityConfigured is true. */
export const authGateway = {
  async registerEmail(email, password) {
    const result = await createUserWithEmailAndPassword(auth(), email, password);
    await sendEmailVerification(result.user);
    return result.user;
  },
  signInEmail(email, password) { return signInWithEmailAndPassword(auth(), email, password); },
  resetPassword(email) { return sendPasswordResetEmail(auth(), email); },
  signInGoogle() { return signInWithPopup(auth(), new GoogleAuthProvider()); },
  signInApple() {
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email'); provider.addScope('name');
    return signInWithPopup(auth(), provider);
  },
  signOut() { return signOut(auth()); },
  // Phone OTP deliberately belongs in a native/specialized UI using Firebase's
  // platform verifier. Do not collect an OTP until that verifier is initialized.
};
