import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  getDocFromServer,
  Firestore,
  query,
  orderBy
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";
import { LeadSubmission, SpecialistProfile } from "../types";

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
} else {
  app = getApp();
}

// Support custom firestoreDatabaseId if specified
export const auth: Auth = getAuth(app);
const customDbId = (firebaseConfig as Record<string, any>).firestoreDatabaseId;
export const db: Firestore = customDbId
  ? getFirestore(app, customDbId)
  : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();

// Required initial connection verification as mandated by skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase Firestore connection verified successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore client is currently in offline mode.");
    }
  }
}
testConnection();

// Authentication Helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Firestore Lead Synchronization
export async function saveLeadToFirestore(lead: LeadSubmission): Promise<void> {
  try {
    const leadRef = doc(db, "leads", lead.id);
    await setDoc(leadRef, {
      ...lead,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Failed to persist lead to Firestore directly:", err);
  }
}

export async function updateLeadInFirestore(leadId: string, updates: Partial<LeadSubmission>): Promise<void> {
  try {
    const leadRef = doc(db, "leads", leadId);
    await updateDoc(leadRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to update lead in Firestore:", err);
  }
}

export function subscribeToFirestoreLeads(
  onUpdate: (leads: LeadSubmission[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const leadsCol = collection(db, "leads");
    return onSnapshot(
      leadsCol,
      (snapshot) => {
        const list: LeadSubmission[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as any) });
        });
        // Sort newest first
        list.sort(
          (a, b) =>
            new Date(b.createdAt || b.submittedAt || 0).getTime() -
            new Date(a.createdAt || a.submittedAt || 0).getTime()
        );
        onUpdate(list);
      },
      (error) => {
        console.warn("Firestore leads snapshot listener notice:", error.message);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn("Could not attach Firestore listener:", err);
    return () => {};
  }
}

// Specialist Profile Firestore Sync
export async function saveSpecialistToFirestore(profile: SpecialistProfile): Promise<void> {
  try {
    const profileRef = doc(db, "specialists", "main_profile");
    await setDoc(profileRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Could not save profile to Firestore:", err);
  }
}

export async function fetchSpecialistFromFirestore(): Promise<SpecialistProfile | null> {
  try {
    const profileRef = doc(db, "specialists", "main_profile");
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      return snap.data() as SpecialistProfile;
    }
  } catch (err) {
    console.warn("Could not fetch profile from Firestore:", err);
  }
  return null;
}
