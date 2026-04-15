import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

const StatCard = ({ icon: Icon, label, value }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card p-6 shadow-card"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="rounded-lg bg-primary/10 p-2">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </div>
    <p className="text-3xl font-bold font-display">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </motion.div>
);

export default StatCard;
