import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, ShieldCheck, Sparkles } from "lucide-react";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("user");
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    signup(username, email, password, role, plan);
    navigate(role === "admin" ? "/admin" : "/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Flame className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-display text-primary">DARE</h1>
          </div>
          <p className="text-muted-foreground">Join the challenge. Build your streak.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-8 shadow-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Choose your plan</p>
                <p className="text-xs text-muted-foreground mt-1">Free plan is best to start. Pro unlocks more room options.</p>
              </div>
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">Default: Free</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {([
                {
                  id: "free",
                  title: "Free Plan",
                  description: "Best for new admins starting small.",
                  features: ["1 room", "Private rooms only", "Up to 10 participants"],
                  icon: ShieldCheck,
                },
                {
                  id: "pro",
                  title: "Pro Plan",
                  description: "Mock upgrade for bigger groups and public rooms.",
                  features: ["Multiple rooms", "Public rooms", "Larger audiences"],
                  icon: Sparkles,
                },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlan(item.id)}
                    className={`rounded-3xl border p-5 text-left transition-all ${
                      plan === item.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-muted hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      {item.features.map((feature) => (
                        <p key={feature} className="flex items-center gap-2">
                          <span className="block h-2.5 w-2.5 rounded-full bg-primary" /> {feature}
                        </p>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="dare_devil"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="••••••••"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-destructive text-xs mt-1">Passwords don't match</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Sign up as</label>
            <div className="flex gap-3">
              {(["user", "admin"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                    role === r
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground hover:bg-surface-hover"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full gradient-fire rounded-lg py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Start Your Streak
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;