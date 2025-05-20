import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
// 👇 adjust the import path based on where your routes actually live
import { registerRoutes } from "./routes";
const app = express();
// Enable CORS for local testing and client requests
app.use(cors());
app.use(express.json());
// Register your API routes (GET /api/listings, POST /api/offer, etc.)
registerRoutes(app);
// Export the Express app as an HTTPS Cloud Function named "api"
export const api = functions.https.onRequest(app);
