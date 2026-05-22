import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { AIRecommendationPage } from "./pages/AIRecommendationPage";
import { DestinationDetailPage } from "./pages/DestinationDetailPage";
import { ItineraryPlannerPage } from "./pages/ItineraryPlannerPage";
import { CommunityFeedPage } from "./pages/CommunityFeedPage";
import { ChatPage } from "./pages/ChatPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "discover", Component: AIRecommendationPage },
      { path: "destination/:id", Component: DestinationDetailPage },
      { path: "itinerary/:id", Component: ItineraryPlannerPage },
      { path: "community", Component: CommunityFeedPage },
      { path: "chat/:userId?", Component: ChatPage },
      { path: "profile/:userId?", Component: ProfilePage },
      { path: "admin", Component: AdminDashboardPage },
    ],
  },
]);
