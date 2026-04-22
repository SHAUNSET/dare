import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface DareCardProps {
  title: string;
  description: string;
  category?: "Social" | "Mental" | "Physical" | "Personal" | "Life";
}

const DareCard = ({ title, description, category }: DareCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card p-6 shadow-card"
  >
    <div className="flex items-start gap-4">
      <div className="rounded-lg gradient-fire p-2.5">
        <Target className="h-5 w-5 text-primary-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="text-lg font-bold font-display text-foreground">{title}</h3>
          {category && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">
              {category}
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default DareCard;
