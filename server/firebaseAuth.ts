import type { Express, Request, Response, NextFunction } from "express";
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const auth = admin.auth();

export async function setupAuth(app: Express) {
  // Middleware to verify Firebase ID tokens
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split(' ')[1];
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        (req as any).user = decodedToken;
      } catch (error) {
        console.error("Error verifying Firebase ID token:", error);
        // Optionally send 401 if token is invalid, but for now, just log and proceed
      }
    }
    next();
  });
  console.log("firebaseAuth: Firebase Auth middleware loaded.");
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if ((req as any).user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

export async function loginUser(email: string, password: string) {
  // Firebase Admin SDK does not have a direct login function for users with email/password.
  // This function is typically handled on the client-side using Firebase Client SDK.
  // However, if you need to verify credentials on the server, you would typically
  // receive an ID token from the client after they log in and verify it using verifyIdToken.
  // For the purpose of this server-side placeholder, we'll just log the attempt.
  console.log(`Attempting server-side login for email: ${email}`);
  // In a real scenario, you might interact with a different service or database
  // to validate credentials if not using Firebase Client SDK for login.
  throw new Error("Server-side email/password login is not directly supported by Firebase Admin SDK. Use client-side SDK for login.");
}

export async function registerUser(email: string, password: string) {
  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });
    console.log('Successfully created new user:', userRecord.uid);
    return userRecord;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
}
