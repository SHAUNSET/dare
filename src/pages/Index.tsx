import { useNavigate } from "react-router-dom";
import { Flame, Sun, Moon } from "lucide-react";
import { useAppTheme } from "@/context/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppTheme();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 rounded-xl bg-card border border-border hover:bg-surface-hover transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="w-full max-w-6xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3">
            <Flame className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">DARE</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Choose your role and enter the app</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-border/70 bg-card/95 p-10 shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4">User</div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">Start doing, not scrolling</h1>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>Join daily dares</p>
              <p>Build streaks</p>
              <p>See real participation</p>
            </div>
            <button
              onClick={() => navigate("/login?role=user")}
              className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-orange-500/20 transition duration-200 hover:shadow-lg hover:scale-[1.01]"
            >
              Start as User
            </button>
          </div>

          <div className="rounded-[32px] border border-border/70 bg-card/95 p-10 shadow-xl transition-transform duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-accent mb-4">Admin</div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground leading-tight">Build your own challenge space</h1>
            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <p>Create rooms</p>
              <p>Set dares</p>
              <p>Manage participation</p>
            </div>
            <button
              onClick={() => navigate("/login?role=admin")}
              className="mt-10 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-orange-500/20 transition duration-200 hover:shadow-lg hover:scale-[1.01]"
            >
              Create a Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
