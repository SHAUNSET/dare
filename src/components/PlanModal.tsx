import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Sparkles, X } from "lucide-react";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: "free" | "pro") => void;
}

const PlanModal = ({ isOpen, onClose, onSelectPlan }: PlanModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free");

  const handleConfirm = () => {
    onSelectPlan(selectedPlan);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md mx-4 bg-card rounded-xl border border-border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-2">Choose Your Plan</h2>
              <p className="text-muted-foreground text-center text-sm mb-6">
                Start free and upgrade anytime. Pro unlocks more room options.
              </p>

              <div className="space-y-4">
                {([
                  {
                    id: "free" as const,
                    title: "Free Plan",
                    description: "Best for new admins starting small.",
                    features: ["1 room", "Private rooms only", "Up to 10 participants"],
                    icon: ShieldCheck,
                  },
                  {
                    id: "pro" as const,
                    title: "Pro Plan",
                    description: "Mock upgrade for bigger groups and public rooms.",
                    features: ["Multiple rooms", "Public rooms", "Larger audiences"],
                    icon: Sparkles,
                  },
                ]).map((plan) => {
                  const Icon = plan.icon;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-muted hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="rounded-lg bg-primary/10 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{plan.title}</p>
                          <p className="text-xs text-muted-foreground">{plan.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        {plan.features.map((feature) => (
                          <p key={feature} className="flex items-center gap-2">
                            <span className="block h-1.5 w-1.5 rounded-full bg-primary" /> {feature}
                          </p>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleConfirm}
                className="w-full mt-6 gradient-fire rounded-lg py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlanModal;