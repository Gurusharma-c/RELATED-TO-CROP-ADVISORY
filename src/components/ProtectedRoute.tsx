import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession();
    session.then((res) => {
      if (res?.data?.session) setAuthed(true);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session?.access_token);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!authed) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
