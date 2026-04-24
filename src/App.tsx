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
    try {
      // Thiết lập một khoảng thời gian chờ tối đa (Timeout) là 5 giây
      const user = await Promise.race([
        checkAuth(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
      ]);
      
      if (user) setCurrentUser(user);
    } catch (error) {
      console.warn("⚠️ Backend phản hồi chậm hoặc chưa đăng nhập.");
    } finally {
      // Dù thành công hay thất bại (do server ngủ), vẫn tắt loading để hiện trang Login
      setLoading(false); 
    }
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