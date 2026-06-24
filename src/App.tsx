import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
        <Analytics />
      </AuthProvider>
    </ThemeProvider>
  );
}
