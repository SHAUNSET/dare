import { useNavigate } from "react-router-dom";
import { Flame, Sun, Moon } from "lucide-react";
import { useAppTheme } from "@/context/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useAppTheme();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white flex items-center justify-center px-4 py-8">
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 rounded-2xl border border-slate-200 bg-white/95 p-2 text-slate-950 shadow-sm transition duration-200 hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-3">
            <Flame className="h-12 w-12 text-primary" />
            <span className="text-6xl sm:text-7xl font-extrabold tracking-[-0.05em] leading-tight">DARE</span>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xl font-semibold text-slate-700 dark:text-slate-300">
            Do something new. Every day.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500 dark:text-slate-400">
            Choose your role. Enter the app.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex h-full flex-col rounded-[32px] border border-slate-200 bg-slate-50 p-10 shadow-xl transition duration-200 hover:scale-[1.02] hover:border-primary/60 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-primary/40">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-primary mb-4">User</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-950 dark:text-white leading-tight">
                Start doing, not scrolling
              </h2>
              <div className="mt-7 space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                <p>One dare. Every day</p>
                <p>Join, act, connect</p>
                <p>Submit. See others</p>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={() => navigate("/login?role=user")}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl gradient-fire px-6 text-sm font-semibold text-primary-foreground shadow-glow transition duration-200 hover:scale-[1.02]"
              >
                Start as User
              </button>
            </div>
          </div>

          <div className="flex h-full flex-col rounded-[32px] border border-slate-200 bg-slate-50 p-10 shadow-xl transition duration-200 hover:scale-[1.02] hover:border-orange-400/40 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-orange-400/40">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.28em] text-accent mb-4">Admin</div>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-950 dark:text-white leading-tight">
                Build your challenge space
              </h2>
              <div className="mt-7 space-y-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                <p>Create your room</p>
                <p>Set daily dares</p>
                <p>Track real activity</p>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={() => navigate("/login?role=admin")}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl gradient-fire px-6 text-sm font-semibold text-primary-foreground shadow-glow transition duration-200 hover:scale-[1.02]"
              >
                Create a Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
