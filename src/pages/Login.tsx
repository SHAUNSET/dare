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
        <div className="bg-card rounded-xl border border-border shadow-card">
          {/* Header */}
          <div className="text-center p-8 pb-0">
            <div className="inline-flex items-center gap-2 mb-4">
              <Flame className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold font-display text-foreground">DARE</h1>
            </div>
            <p className="text-muted-foreground">Join the movement. Start your streak.</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mx-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                isLogin
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                !isLogin
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium capitalize transition-all ${
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
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        plan === "free"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted hover:border-primary/40"
                      }`}
                    >
                      <div className={`text-xs font-medium ${plan === "free" ? "text-primary" : "text-foreground"}`}>Free Plan</div>
                      <div className={`text-xs mt-1 ${plan === "free" ? "text-primary" : "text-muted-foreground"}`}>
                        <div>1 room</div>
                        <div>Private only</div>
                        <div>Max 10 users</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlan("pro")}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        plan === "pro"
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted hover:border-primary/40"
                      }`}
                    >
                      <div className={`text-xs font-medium ${plan === "pro" ? "text-primary" : "text-foreground"}`}>Pro Plan</div>
                      <div className={`text-xs mt-1 ${plan === "pro" ? "text-primary" : "text-muted-foreground"}`}>
                        <div>Multiple rooms</div>
                        <div>Public + private</div>
                        <div>Larger groups</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {isLogin ? "Login" : "Start Your Streak"}
              </button>
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