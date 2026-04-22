import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Clock } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import { useDare } from "@/context/DareContext";

const ManageDare = () => {
  const { currentDare, setCurrentDare, dareTime, setDareTime } = useDare();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState(dareTime);
  const [category, setCategory] = useState<"Social" | "Mental" | "Physical" | "Personal" | "Life">("Social");

  const handleSet = () => {
    if (!title || !description) return;
    setCurrentDare({ id: `d-${Date.now()}`, title, description, category });
    setDareTime(time);
    setTitle("");
    setDescription("");
    setCategory("Social");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold font-display">Manage Daily Dare</h1>
          <p className="text-muted-foreground text-sm mt-1">Set today's challenge for all users</p>
        </div>

        {/* Current dare */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Active Dare</h2>
          </div>
          <div className="flex items-start gap-3 mb-2">
            <h3 className="text-lg font-bold font-display">{currentDare.title}</h3>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary whitespace-nowrap">
              {currentDare.category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{currentDare.description}</p>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Goes live daily at {dareTime}</span>
          </div>
        </motion.div>

        {/* Set new dare */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Set New Dare</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dare title"
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Dare description"
            rows={3}
            className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
          />
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" /> Category (Required)
            </label>
            <div className="flex flex-wrap gap-2">
              {(["Social", "Mental", "Physical", "Personal", "Life"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary border-2 shadow-lg"
                      : "bg-muted text-muted-foreground border-2 border-border hover:border-primary/30 hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Dare Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="rounded-lg border border-border bg-muted px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={handleSet}
            disabled={!title || !description}
            className="gradient-fire rounded-lg px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Set as Today's Dare
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageDare;
