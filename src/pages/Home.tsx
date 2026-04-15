import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import DareCard from "@/components/DareCard";
import FeedCard from "@/components/FeedCard";
import CountdownTimer from "@/components/CountdownTimer";
import SubmitModal from "@/components/SubmitModal";
import { useDare } from "@/context/DareContext";

const Home = () => {
  const { currentDare, submittedToday, streak, feedItems } = useDare();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
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
          <DareCard title={currentDare.title} description={currentDare.description} />
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
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">Community Feed</h2>

          {!submittedToday && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-background/70 backdrop-blur-md">
              <Lock className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="text-lg font-bold font-display mb-1">Feed Locked</h3>
              <p className="text-sm text-muted-foreground">Complete today's dare to unlock</p>
            </div>
          )}

          <div className={`space-y-4 ${!submittedToday ? "blur-sm pointer-events-none select-none" : ""}`}>
            {feedItems.map((item) => (
              <FeedCard key={item.id} username={item.username} type={item.type} content={item.content} timestamp={item.timestamp} />
            ))}
          </div>
        </section>
      </main>

      <SubmitModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
