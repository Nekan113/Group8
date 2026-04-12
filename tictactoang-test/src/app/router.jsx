import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import DashboardPage from "../pages/DashboardPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import GamePage from "../pages/GamePage";
import PremiumPage from "../pages/PremiumPage";
import AdminPage from "../pages/AdminPage";
import AdminRoute from "../components/common/AdminRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "game", element: <GamePage /> },
      { path: "premium", element: <PremiumPage /> },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;