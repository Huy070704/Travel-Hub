import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import "./styles/index.css";

const GOOGLE_CLIENT_ID = "221083058964-9f62jku7b16ov0rk1144hd7td3mji2c8.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);