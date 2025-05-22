import type { Express, Request, Response, NextFunction } from "express";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY - Supabase auth will be disabled.");
}

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : undefined;

export async function setupAuth(app: Express) {
  // Middleware to verify Supabase tokens
  app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (!supabase) {
      console.warn("Supabase client not initialized. Skipping auth middleware.");
      return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
          console.error("Error verifying Supabase token:", error.message);
          // Optionally send 401 if token is invalid, but for now, just log and proceed
        } else {
          (req as any).user = user;
        }
      } catch (error: any) {
        console.error("Error verifying Supabase token:", error.message);
        // Optionally send 401 if token is invalid, but for now, just log and proceed
      }
    }
    next();
  });
  console.log("firebaseAuth: Supabase Auth middleware loaded.");
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if ((req as any).user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

// Note: Supabase authentication (login/register) is typically handled client-side.
// These functions are placeholders and should not be used for direct server-side
// email/password authentication in a production environment.
export async function loginUser(email: string, password: string) {
   console.log(`Attempting server-side login placeholder for email: ${email}`);
   throw new Error("Server-side email/password login should be handled client-side with Supabase JS SDK.");
}

export async function registerUser(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase client not initialized.");
  }
  try {
    // This is a server-side registration placeholder.
    // Client-side registration using Supabase JS SDK is recommended.
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error('Error creating new user:', error.message);
      throw error;
    }
    console.log('Successfully created new user:', data.user?.id);
    return data.user;
  } catch (error: any) {
    console.error('Error creating new user:', error.message);
    throw error;
  }
}
