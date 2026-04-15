import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface FeedCardProps {
  username: string;
  type: "image" | "video" | "text" | "audio";
  content: string;
  timestamp: string;
}

const FeedCard = ({ username, type, content, timestamp }: FeedCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-colors shadow-card"
  >
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm text-foreground">@{username}</span>
        <span className="text-xs text-muted-foreground">{timestamp}</span>
      </div>

      {type === "image" && (
        <img src={content} alt="submission" className="w-full rounded-lg object-cover max-h-64 mb-3" />
      )}
      {type === "text" && (
        <p className="text-sm text-secondary-foreground bg-muted rounded-lg p-3 mb-3">{content}</p>
      )}
      {type === "video" && (
        <div className="w-full rounded-lg bg-muted flex items-center justify-center h-48 mb-3 text-muted-foreground text-sm">
          🎥 Video submission
        </div>
      )}
      {type === "audio" && (
        <div className="w-full rounded-lg bg-muted flex items-center justify-center h-16 mb-3 text-muted-foreground text-sm">
          🎙️ Audio submission
        </div>
      )}

      <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
        <Heart className="h-4 w-4" />
      </button>
    </div>
  </motion.div>
);

export default FeedCard;