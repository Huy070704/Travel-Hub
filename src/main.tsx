import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react";
import ReactGA from "react-ga4";
import App from "./App";
import "./styles/index.css";

const GOOGLE_CLIENT_ID =
  "779479919606-hcpsuu5jij6fp6t5ams1595b80q829ko.apps.googleusercontent.com";

ReactGA.initialize("G-PP39SX2K3P");

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
    <Analytics />
  </GoogleOAuthProvider>
);