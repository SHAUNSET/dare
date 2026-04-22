import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import DareCard from "@/components/DareCard";
import FeedCard from "@/components/FeedCard";
import CountdownTimer from "@/components/CountdownTimer";
import SubmitModal from "@/components/SubmitModal";
import { useDare } from "@/context/DareContext";
import { useAuth } from "@/context/AuthContext";

const Home = () => {
  const { currentDare, submittedToday, streak, feedItems } = useDare();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [filterMode, setFilterMode] = useState<"global" | "nearby">("global");

  const filteredFeed = feedItems.filter((item) => {
    if (filterMode === "nearby" && user?.city) {
      return item.city === user.city;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-14 sm:pb-0">
      <Navbar />
      <main className="w-full max-w-full lg:max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-8 space-y-8">
        {/* Streak & Timer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="h-7 w-7 text-primary animate-pulse-glow" />
            <span className="text-2xl font-bold font-display">{streak} Day Streak</span>
          </div>
          <CountdownTimer />
        </motion.div>

        {/* Today's Dare */}
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Today's Dare</h2>
          <DareCard title={currentDare.title} description={currentDare.description} category={currentDare.category} />
        </section>

        {/* CTA */}
        {!submittedToday && (
          <button
            onClick={() => setModalOpen(true)}
            className="w-full gradient-fire rounded-xl py-4 font-bold text-primary-foreground text-lg transition-all hover:opacity-90 active:scale-[0.98] shadow-glow"
          >
            Complete Today's Dare
          </button>
        )}

        {/* Feed */}
        <section className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Community Feed</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterMode("global")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === "global"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Global
              </button>
              <button
                onClick={() => setFilterMode("nearby")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterMode === "nearby"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                Nearby
              </button>
            </div>
          </div>

          {!submittedToday && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-md">
              <Lock className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="text-lg font-bold font-display mb-1">Feed Locked</h3>
              <p className="text-sm text-muted-foreground">Complete today's dare to unlock</p>
            </div>
          )}

          <div className={`space-y-4 ${!submittedToday ? "blur-sm pointer-events-none select-none" : ""}`}>
            {filteredFeed.length === 0 && submittedToday && filterMode === "nearby" ? (
              <div className="rounded-xl border border-dashed border-border bg-muted p-8 text-center">
                <p className="text-sm font-semibold text-foreground">No nearby submissions</p>
                <p className="mt-2 text-sm text-muted-foreground">Switch to Global to see submissions from everywhere.</p>
              </div>
            ) : (
              filteredFeed.map((item) => (
                <FeedCard key={item.id} username={item.username} city={item.city} type={item.type} content={item.content} timestamp={item.timestamp} category={item.category} />
              ))
            )}
          </div>
        </section>
      </main>

      <SubmitModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
