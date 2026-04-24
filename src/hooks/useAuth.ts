import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, logout } from "../services/authApi";
import { useAuthStore } from "../stores/authStore";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, setUser, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    setLoading(true);
    message.loading({ content: "Redirecting to Google...", key: "auth_action" });
    loginWithGoogle();
  };

  const handleLogout = async () => {
    setLoading(true);
    message.loading({ content: "Logging out...", key: "auth_action" });

    try {
      await logout();
      clearAuth();
      message.success({ content: "Successfully logged out!", key: "auth_action" });
      navigate("/login");
    } catch (error) {
      message.error({ content: "Error occurred while logging out. Please try again.", key: "auth_action" });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    setUser,
    loading,
    handleGoogleLogin,
    handleLogout,
  };
}