import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

interface AdminOnboardingProps {
  onComplete: (dareTime: string) => void;
}

const AdminOnboarding = ({ onComplete }: AdminOnboardingProps) => {
  const [dareTime, setDareTime] = useState("08:00");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-border bg-card p-8 shadow-card max-w-md w-full mx-4 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="h-14 w-14 rounded-full gradient-fire flex items-center justify-center mx-auto">
            <Flame className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold font-display">Welcome, Admin!</h1>
          <p className="text-sm text-muted-foreground">Before you get started, let's set up your daily dare schedule.</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            When should the daily dare go live?
          </label>
          <input
            type="time"
            value={dareTime}
            onChange={(e) => setDareTime(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground text-center text-lg font-display focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <p className="text-xs text-muted-foreground text-center">Users will receive the new dare at this time daily</p>
        </div>

        <button
          onClick={() => onComplete(dareTime)}
          className="w-full gradient-fire rounded-xl py-3.5 font-bold text-primary-foreground text-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Let's Go
        </button>
      </motion.div>
    </div>
  );
};

export default AdminOnboarding;