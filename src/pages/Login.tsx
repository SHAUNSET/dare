import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useAppTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { Flame, Target, Users, Zap, Sun, Moon } from "lucide-react";
import PlanModal from "@/components/PlanModal";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
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
    <div className="min-h-screen bg-background flex">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 rounded-lg bg-card border border-border hover:bg-surface-hover transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {/* Left Side - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-accent/5 flex-col justify-center px-12">
        <div className="max-w-md mx-auto text-center space-y-8">
          {/* App Name */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <Flame className="h-10 w-10 text-primary" />
              <h1 className="text-6xl font-bold font-display text-foreground">DARE</h1>
            </div>
            <p className="text-xl text-muted-foreground font-medium">
              Do something new. Every day.
            </p>
            <p className="text-sm text-muted-foreground">
              Small actions. Real growth. Alone or with people who push you.
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-foreground">
              <Target className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-left">Daily challenges that actually matter</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <Users className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-left">Join rooms and do it together</span>
            </div>
            <div className="flex items-center gap-3 text-foreground">
              <Zap className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-left">Stay consistent, track your streak</span>
            </div>
          </div>

          {/* Admin Highlight */}
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground">
              Create your own room. Set the dare. Build your group.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <p className="text-lg font-semibold text-primary">
              Start your streak
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-8">
        <div className="w-full max-w-md">
          {/* Mobile Marketing */}
          <div className="lg:hidden text-center mb-8 space-y-6">
            <div className="inline-flex items-center gap-2">
              <Flame className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold font-display text-foreground">DARE</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Do something new. Every day.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Daily challenges that actually matter</p>
              <p>• Join rooms and do it together</p>
              <p>• Stay consistent, track your streak</p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-card rounded-xl border border-border shadow-card">
            {/* Tabs */}
            <div className="flex border-b border-border">
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
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {isLogin ? "Login" : "Start Your Streak"}
                </button>
              </form>
            </div>
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