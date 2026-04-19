import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Users, Target, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Marketing */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-red-50 flex-col justify-center px-12">
        <div className="max-w-md mx-auto text-center space-y-8">
          {/* App Name */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3">
              <Flame className="h-10 w-10 text-orange-500" />
              <h1 className="text-6xl font-bold font-display text-gray-900">DARE</h1>
            </div>
            <p className="text-xl text-gray-600 font-medium">
              Do something uncomfortable. Every day.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <Target className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <span className="text-left">Break your comfort zone</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Zap className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <span className="text-left">Build real confidence</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="h-5 w-5 text-orange-500 flex-shrink-0" />
              <span className="text-left">Real socialization (not scrolling)</span>
            </div>
          </div>

          {/* Admin Highlight */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-orange-100">
            <p className="text-sm text-gray-600">
              Create private rooms, build communities, track participation
            </p>
          </div>

          {/* CTA */}
          <div className="pt-4">
            <p className="text-lg font-semibold text-orange-600">
              Start your streak today
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
              <Flame className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold font-display text-gray-900">DARE</h1>
            </div>
            <p className="text-lg text-gray-600">
              Do something uncomfortable. Every day.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Break your comfort zone</p>
              <p>• Build real confidence</p>
              <p>• Real socialization (not scrolling)</p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                  isLogin
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                  !isLogin
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-500 hover:text-gray-700"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="dare_devil"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                      placeholder="••••••••"
                    />
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-red-600 text-xs mt-1">Passwords don't match</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
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
                            ? "bg-orange-100 text-orange-700 border border-orange-300"
                            : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {!isLogin && role === "admin" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Plan
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPlan("free")}
                        className={`p-3 border rounded-lg text-left transition-colors ${
                          plan === "free"
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 bg-gray-50 hover:border-orange-300"
                        }`}
                      >
                        <div className={`text-xs font-medium ${plan === "free" ? "text-orange-700" : "text-gray-900"}`}>Free Plan</div>
                        <div className={`text-xs mt-1 ${plan === "free" ? "text-orange-600" : "text-gray-600"}`}>
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
                            ? "border-orange-300 bg-orange-50"
                            : "border-gray-200 bg-gray-50 hover:border-orange-300"
                        }`}
                      >
                        <div className={`text-xs font-medium ${plan === "pro" ? "text-orange-700" : "text-gray-900"}`}>Pro Plan</div>
                        <div className={`text-xs mt-1 ${plan === "pro" ? "text-orange-600" : "text-gray-600"}`}>
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
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
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