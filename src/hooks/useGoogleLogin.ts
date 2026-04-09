import { useState } from "react";
import { message } from "antd";
import loginWithGgApi from "../services/loginWithGgApi";

export default function useGoogleLogin() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleGoogleLogin = () => {
    setGoogleLoading(true);

    messageApi.loading({
      content: "Redirecting to Google...",
      duration: 1.5,
    });

    loginWithGgApi();
  };

  return {
    googleLoading,
    handleGoogleLogin,
    contextHolder,
  };
}