import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CreatePropertyPage from "./pages/CreatePropertyPage";
import TwoFactorSetupPage from "./pages/TwoFactorSetupPage";
import BookPropertyPage from "./pages/BookPropertyPage";
import ReservationsPage from "./pages/ReservationsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties/new"
        element={
          <ProtectedRoute>
            <CreatePropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/2fa/setup"
        element={
          <ProtectedRoute>
            <TwoFactorSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/properties/:id/book"
        element={
          <ProtectedRoute>
            <BookPropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <ReservationsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
