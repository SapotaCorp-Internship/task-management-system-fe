import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../utils/checkAuth";

export default function ProtectedRoute({ children }: any) {

  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const user = await checkAuth();

      if (user) {
        setAuth(true);
      }

      setLoading(false);
    };

    verify();
  }, []);

  if (loading) return <div>Checking login...</div>;

  if (!auth) return <Navigate to="/login" replace />;

  return children;
}
