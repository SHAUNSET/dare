import { Moon, SunMedium } from "lucide-react";
import { useAppTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useAppTheme();

  return (
    <div className="inline-flex items-center rounded-full border border-border bg-card p-1 text-sm text-foreground">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
          theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <SunMedium className="h-4 w-4" /> Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 transition ${
          theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
        }`}
      >
        <Moon className="h-4 w-4" /> Dark
      </button>
    </div>
  );
};

export default ThemeToggle;
