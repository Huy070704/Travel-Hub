import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./routes";
import { ThemeProvider } from "next-themes";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
