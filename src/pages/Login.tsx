import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useLocation, useNavigate } from "react-router-dom";
import { Flame, Sun, Moon } from "lucide-react";
import PlanModal from "@/components/PlanModal";

const Login = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(
    query.get("role") === "admin" ? "admin" : "user"
  );
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const { login, signup } = useAuth();
  const { theme, toggleTheme } = useAppTheme();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password, role);
      navigate(role === "admin" ? "/admin" : "/home");
    } else {
      if (password !== confirmPassword) return;
      signup(username, email, password, role, plan);
      if (role === "admin") {
        setShowPlanModal(true);
      } else {
        navigate("/home");
      }
    }
  };

  const handlePlanSelect = (plan: "free" | "pro") => {
    // Update user plan in context or backend
    // For now, just navigate
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-card border border-border hover:bg-surface-hover transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Back to Home */}
      <button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-card border border-border hover:bg-surface-hover transition-colors"
        aria-label="Back to home"
      >
        <Flame className="h-4 w-4 text-primary" />
      </button>

      {/* Auth Card */}
      <div className="w-full max-w-md">
        <div className="flex min-h-[520px] flex-col rounded-xl border border-border bg-card shadow-card transition-all duration-300">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Flame className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-display text-foreground">DARE</h1>
            </div>
            <p className="text-sm text-muted-foreground">Join the movement. Start your streak.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border px-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-medium transition-all ${
                isLogin
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-medium transition-all ${
                !isLogin
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col px-8 pb-8">
            <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
              <div className="space-y-5 pt-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                      placeholder="dare_devil"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors text-foreground placeholder:text-muted-foreground"
                      placeholder="••••••••"
                    />
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-destructive text-xs mt-1">Passwords don't match</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    {isLogin ? "Login as" : "Sign up as"}
                  </label>
                  <div className="flex gap-3">
                    {(["user", "admin"] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium capitalize transition-all ${
                          role === r
                            ? "bg-primary text-primary-foreground border border-primary"
                            : "bg-muted text-muted-foreground border border-border hover:bg-surface-hover"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {!isLogin && role === "admin" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Plan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPlan("free")}
                        className={`rounded-lg border p-3 text-left text-xs transition-colors ${
                          plan === "free"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-muted text-foreground hover:border-primary/40"
                        }`}
                      >
                        <div className="font-semibold">Free Plan</div>
                        <div className="mt-1 text-muted-foreground">
                          <div>1 room</div>
                          <div>Private only</div>
                          <div>Max 10 users</div>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlan("pro")}
                        className={`rounded-lg border p-3 text-left text-xs transition-colors ${
                          plan === "pro"
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-muted text-foreground hover:border-primary/40"
                        }`}
                      >
                        <div className="font-semibold">Pro Plan</div>
                        <div className="mt-1 text-muted-foreground">
                          <div>Multiple rooms</div>
                          <div>Public + private</div>
                          <div>Larger groups</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-4">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {isLogin ? "Login" : "Start Your Streak"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <PlanModal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        onSelectPlan={handlePlanSelect}
      />
    </div>
  );

};

export default Login;