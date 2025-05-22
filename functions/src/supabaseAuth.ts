import type { Express, Request, Response, NextFunction } from "express";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// These environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
// need to be set in the Firebase Cloud Functions environment.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY for functions environment - Supabase auth will be disabled.");
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized for functions environment.");
}

export async function setupAuth(app: Express) {
  // Middleware to verify Supabase tokens
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!supabase) {
      console.warn("Supabase client not initialized for functions. Skipping auth middleware.");
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
          console.error("Error verifying Supabase token in functions:", error.message);
          // Optionally send 401 if token is invalid, but for now, just log and proceed
          // For stricter security, you might want to res.status(401).send('Unauthorized'); return;
        } else {
          (req as any).user = user; // Attach user to request object
        }
      } catch (error: any) {
        console.error("Exception verifying Supabase token in functions:", error.message);
      }
    }
    next();
  });
  console.log("Supabase Auth middleware loaded for functions.");
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Check if user object was attached by setupAuth middleware
  if ((req as any).user) {
    next();
  } else {
    // If no user, but there was an authorization header, it might mean an invalid token
    // If there was no authorization header at all, it means it's an unauthenticated request
    // For now,统一send 401 for simplicity.
    res.status(401).json({ message: "Unauthorized. No valid token provided or user session not found." });
  }
}

// Placeholder functions for login/register, as these are client-side with Supabase
export async function loginUser(email: string, password: string) {
   console.log(`Attempting server-side login placeholder for email in functions: ${email}`);
   throw new Error("Server-side email/password login should be handled client-side with Supabase JS SDK.");
}

export async function registerUser(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase client not initialized in functions.");
  }
  console.log(`Attempting server-side registration placeholder for email in functions: ${email}`);
  throw new Error("Server-side email/password registration should be handled client-side with Supabase JS SDK.");
}
