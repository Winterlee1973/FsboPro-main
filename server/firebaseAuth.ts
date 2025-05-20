import type { Express, Request, Response, NextFunction } from "express";

// TODO: Replace with real Firebase Auth verification
export async function setupAuth(app: Express) {
  // no‑op placeholder – public endpoints
  console.log("firebaseAuth: placeholder middleware loaded.");
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Allow all requests; replace with token check later
  next();
}
