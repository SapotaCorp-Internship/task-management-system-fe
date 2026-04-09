const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  // Lấy URL đăng nhập Google
  getGoogleLoginUrl: () => `${API_URL}/auth/google`,

  // Thực hiện chuyển hướng đăng nhập
  loginWithGoogle: () => {
    window.location.assign(`${API_URL}/auth/google`);
  },

  // Gọi API đăng xuất
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Quan trọng để gửi kèm Session/Cookie
    });
    
    if (!response.ok) {
      throw new Error("Đăng xuất thất bại");
    }
    
    return response.json();
  }
};