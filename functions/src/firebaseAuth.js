// TODO: Replace with real Firebase Auth verification
export async function setupAuth(app) {
    // no‑op placeholder – public endpoints
    console.log("firebaseAuth: placeholder middleware loaded.");
}
export function isAuthenticated(req, res, next) {
    // Allow all requests; replace with token check later
    next();
}
