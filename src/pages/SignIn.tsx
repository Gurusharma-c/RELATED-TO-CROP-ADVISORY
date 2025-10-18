import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Invalid email";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data?.session || data?.user) {
        // optionally persist a remember flag in localStorage for mock flows
        if (remember) localStorage.setItem("remember", "1");
        toast({ title: "Signed in", description: "Redirecting to app" });
        navigate("/home");
      } else {
        toast({
          title: "Check your email",
          description: "If your account requires confirmation, follow the link sent to your email.",
        });
      }
    } catch (err: any) {
      setErrorMessage(err?.message || String(err));
      toast({ title: "Sign in failed", description: err?.message || String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image (place your image at public/auth-bg.jpg) */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/auth-bg.jpg"
          alt="background"
          className="w-full h-full object-cover filter blur-sm opacity-90"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-transparent border border-white/20 rounded-2xl p-8 shadow-md animate-in slide-in-from-right-8 backdrop-blur-md">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md">
              <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email"
                required
                placeholder="you@farm.com"
                className="w-full input"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <label className="block text-sm font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-label="Password"
                  required
                  placeholder="••••••••"
                  className="w-full input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/signup" className="text-sm text-primary underline">Create account</Link>
            </div>

            {errorMessage && <div className="text-sm text-destructive">{errorMessage}</div>}

            <div className="flex flex-col gap-3">
              <button
                onClick={(e) => { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent); }}
                className={`w-full py-3 rounded-xl font-semibold text-primary bg-transparent border border-border hover:bg-primary/10 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px bg-border flex-1" />
                <div className="text-xs text-muted-foreground">or continue with</div>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="py-2 rounded-lg border border-border flex items-center justify-center gap-2">🔒 Google</button>
                <button className="py-2 rounded-lg border border-border flex items-center justify-center gap-2">🔑 Twitter</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
