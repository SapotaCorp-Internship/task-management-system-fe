import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi";

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    setLoading(true);
    message.loading({ content: "Đang chuyển hướng đến Google...", key: "auth_action" });
    authApi.loginWithGoogle();
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    setLoading(true);
    message.loading({ content: "Đang đăng xuất...", key: "auth_action" });
    
    try {
      await authApi.logout();
      message.success({ content: "Đã đăng xuất thành công!", key: "auth_action" });
      
      // Xóa thông tin local nếu cần và điều hướng
      navigate("/login");
    } catch (error) {
      message.error({ content: "Lỗi khi đăng xuất. Vui lòng thử lại.", key: "auth_action" });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleGoogleLogin,
    handleLogout
  };
}