import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { RootLayout } from "../layouts/RootLayout";
import { LandingPage } from "../features/landing/components/LandingPage";
import { AuthPage } from "../features/auth/components/AuthPage";
import { AIRecommendationPage } from "../features/ai-planner/components/AIRecommendationPage";
import { DestinationDetailPage } from "../features/destinations/components/DestinationDetailPage";
import { ItineraryPlannerPage } from "../features/ai-planner/components/ItineraryPlannerPage";
import { TourActivityComparisonPage } from "../features/ai-planner/components/TourActivityComparisonPage";
import { CommunityFeedPage } from "../features/feed/components/CommunityFeedPage";
import { ChatPage } from "../features/chat/components/ChatPage";
import { ProfilePage } from "../features/profile/components/ProfilePage";
import { AdminDashboardPage } from "../features/dashboard/components/AdminDashboardPage";
import { TourSearchPage } from "../features/tours/components/TourSearchPage";
import { TourDetailPage } from "../features/tours/components/TourDetailPage";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "Admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <AuthPage />;
}

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: PublicOnlyRoute,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "discover", Component: AIRecommendationPage },
      { path: "destination/:id", Component: DestinationDetailPage },
      { path: "itinerary/:id", Component: ItineraryPlannerPage },
      { path: "compare", Component: TourActivityComparisonPage },
      { path: "tours", Component: TourActivityComparisonPage },
      { path: "tours/search", Component: TourSearchPage },
      { path: "tours/:id", Component: TourDetailPage },
      { path: "community", Component: CommunityFeedPage },
      {
        path: "",
        Component: ProtectedRoute,
        children: [
          { path: "chat", Component: ChatPage },
          { path: "chat/:userId", Component: ChatPage },
          { path: "profile", Component: ProfilePage },
          { path: "profile/:userId", Component: ProfilePage },
          { path: "admin", Component: () => <AdminRoute><AdminDashboardPage /></AdminRoute> },
        ],
      },
    ],
  },
]);
