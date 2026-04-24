import { useEffect, useState } from "react";
import {
  Card,
  Button,
  Input,
  Typography,
  Divider,
  Alert,
  Spin,
  message,
} from "antd";
import { GoogleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkAuth } from "../utils/checkAuth";
import useAuth from "../hooks/useAuth";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { loading, handleGoogleLogin } = useAuth();

  useEffect(() => {
    let active = true;

    const verifyAuth = async () => {
      const user = await checkAuth();

      if (!active) return;

      if (user) {
        navigate("/dashboard", { replace: true });
        return;
      }

      setCheckingAuth(false);
    };

    verifyAuth();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleLogin = () => {
    void messageApi.info(
      "Email/password login is not connected. You can currently log in with Google.",
    );
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Spin size="large" tip="Checking your session..." />
      </div>
    );
  }

  const loginError =
    searchParams.get("error") === "google_login_failed"
      ? "Google login failed. Please try again."
      : null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {contextHolder}
      <Card className="w-[380px] shadow-lg rounded-xl">
        <div className="text-center mb-6">
          <Title level={3}>TaskFlow</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        {loginError ? (
          <Alert type="error" showIcon message={loginError} className="mb-4" />
        ) : null}

        <Input
          size="large"
          placeholder="Email"
          prefix={<UserOutlined />}
          className="mb-3"
        />

        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          className="mb-4"
        />

        <Button
          type="primary"
          size="large"
          block
          onClick={handleLogin}
          className="mb-4"
        >
          Login
        </Button>

        <Divider>Or</Divider>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          loading={loading}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>

        <div className="text-center mt-4">
          <Text type="secondary">
            Don't have an account? <a href="#">Register</a>
          </Text>
        </div>
      </Card>
    </div>
  );
}