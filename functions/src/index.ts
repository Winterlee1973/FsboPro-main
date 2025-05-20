import * as functions from "firebase-functions";
import express from "express";
import { registerRoutes } from "../server/routes";

const app = express();

// register your API routes
registerRoutes(app);

// Export the Express app as an HTTPS Cloud Function called "api"
export const api = functions.https.onRequest(app);
