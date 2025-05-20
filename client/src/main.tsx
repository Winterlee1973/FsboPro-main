import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Stripe public key from environment variables
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  // Initialize Stripe when the key is available
  // Will be used by the premium listing payment flow
  console.log("Stripe public key is available");
}

createRoot(document.getElementById("root")!).render(<App />);
