import { Flame, LogOut, Home, Users, DoorOpen, UserCircle, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDare } from "@/context/DareContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

const userNavTabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/friends", icon: Users, label: "Friends" },
  { to: "/rooms", icon: DoorOpen, label: "Rooms" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
];

const adminNavTabs = [
  { to: "/admin", icon: Home, label: "Dashboard" },
  { to: "/admin/rooms", icon: DoorOpen, label: "Rooms" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/submissions", icon: FileText, label: "Submissions" },
];

const Navbar = () => {
  const { logout } = useAuth();
  const { streak } = useDare();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const navTabs = isAdmin ? adminNavTabs : userNavTabs;
  const brandLink = isAdmin ? "/admin" : "/home";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Top Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border h-14 sm:h-16 w-full">
        <div className="w-full h-full max-w-full mx-auto flex items-center justify-between px-4 sm:px-6">
          <Link to={brandLink} className="flex items-center gap-2 flex-shrink-0">
            <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-lg sm:text-xl font-bold font-display text-primary">DARE</span>
            {isAdmin && <span className="hidden md:inline text-sm uppercase tracking-[0.18em] text-muted-foreground">Admin</span>}
          </Link>

          {/* Nav Tabs - Desktop Only */}
          <div className="hidden sm:flex items-center gap-1">
            {navTabs.map(({ to, icon: Icon, label }) => {
              const active =
                location.pathname === to ||
                (to !== "/admin" && location.pathname.startsWith(`${to}/`));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Streak - Desktop Only */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary animate-pulse-glow">
              <Flame className="h-4 w-4" />
              <span>{streak}</span>
            </div>

            {/* Theme Toggle - Always Visible */}
            <div className="flex items-center gap-1.5 rounded-full bg-secondary/70 px-2 sm:px-3 py-1.5">
              <ThemeToggle />
            </div>

            {/* Logout Button - Always Visible */}
            <button
              onClick={handleLogout}
              className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-surface-hover transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Only shows below h-screen on mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-border h-14 w-full">
        <div className="flex items-center justify-around h-full w-full">
          {navTabs.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-all flex-1 h-full justify-center ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[0.625rem]">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;