import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface DareCardProps {
  title: string;
  description: string;
}

const DareCard = ({ title, description }: DareCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card p-6 shadow-card"
  >
    <div className="flex items-start gap-4">
      <div className="rounded-lg gradient-fire p-2.5">
        <Target className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-bold font-display text-foreground mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default DareCard;
