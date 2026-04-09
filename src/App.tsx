import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import DashboardContent from "./components/DashboardContent";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useReminder } from "./hooks/useReminder";
import { checkAuth } from "./utils/checkAuth";
import  { useEffect, useState } from "react";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const user = await checkAuth();
      
      if (user) {
        setCurrentUser(user);
      } else {
        console.warn("⚠️ [App] Không tìm thấy user hoặc chưa đăng nhập.");
      }
      setLoading(false);
    }
    initAuth();
  }, []);

  useReminder(currentUser?.id || null);

  if (loading) return <div>Đang tải ứng dụng...</div>;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardContent />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}