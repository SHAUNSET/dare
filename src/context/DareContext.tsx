import React, { createContext, useContext, useState, ReactNode } from "react";

interface Dare {
  id: string;
  title: string;
  description: string;
  category: "Social" | "Mental" | "Physical" | "Personal" | "Life";
}

interface Submission {
  id: string;
  userId: string;
  username: string;
  city: string;
  type: "image" | "video" | "text" | "audio";
  content: string;
  timestamp: string;
  category: "Social" | "Mental" | "Physical" | "Personal" | "Life";
}

interface DareContextType {
  currentDare: Dare;
  submittedToday: boolean;
  streak: number;
  bestStreak: number;
  totalSubmissions: number;
  submissions: Submission[];
  feedItems: Submission[];
  dareTime: string;
  categoryStats: Record<string, number>;
  recentSubmissions: Submission[];
  submitDare: (type: Submission["type"], content: string) => void;
  setCurrentDare: (dare: Dare) => void;
  setDareTime: (time: string) => void;
}

const dummyFeed: Submission[] = [
  { id: "1", userId: "u1", username: "alex_fire", city: "San Francisco", type: "image", content: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop", timestamp: "2 hours ago", category: "Social" },
  { id: "2", userId: "u2", username: "sara_bold", city: "New York", type: "text", content: "Spoke to a complete stranger at the coffee shop today. We ended up talking for 30 minutes about travel!", timestamp: "4 hours ago", category: "Social" },
  { id: "3", userId: "u3", username: "mike_dare", city: "San Francisco", type: "image", content: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop", timestamp: "5 hours ago", category: "Physical" },
  { id: "4", userId: "u4", username: "luna_x", city: "Seattle", type: "text", content: "Cold shower at 6 AM. Brutal but worth it 🥶", timestamp: "6 hours ago", category: "Physical" },
  { id: "5", userId: "u5", username: "jay_run", city: "San Francisco", type: "image", content: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop", timestamp: "8 hours ago", category: "Mental" },
];

const DareContext = createContext<DareContextType | null>(null);

export const useDare = () => {
  const ctx = useContext(DareContext);
  if (!ctx) throw new Error("useDare must be used within DareProvider");
  return ctx;
};

export const DareProvider = ({ children }: { children: ReactNode }) => {
  const [currentDare, setCurrentDare] = useState<Dare>({
    id: "d1",
    title: "Talk to a Stranger",
    description: "Start a genuine conversation with someone you've never met. It could be at a café, park, or anywhere. Step outside your comfort zone.",
    category: "Social",
  });

  const [submittedToday, setSubmittedToday] = useState(false);
  const [streak] = useState(5);
  const [bestStreak] = useState(12);
  const [totalSubmissions] = useState(47);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedItems, setFeedItems] = useState<Submission[]>(dummyFeed);
  const [dareTime, setDareTime] = useState("08:00");
  const [categoryStats] = useState<Record<string, number>>({
    Social: 12,
    Mental: 8,
    Physical: 15,
    Personal: 7,
    Life: 5,
  });

  const submitDare = (type: Submission["type"], content: string) => {
    const newSub: Submission = {
      id: `s-${Date.now()}`,
      userId: "me",
      city: "San Francisco",
      username: "you",
      type,
      content,
      timestamp: "Just now",
      category: currentDare.category,
    };
    setSubmissions((prev) => [newSub, ...prev]);
    setFeedItems((prev) => [newSub, ...prev]);
    setSubmittedToday(true);
  };

  const recentSubmissions = submissions.slice(0, 5);

  return (
    <DareContext.Provider
      value={{ currentDare, submittedToday, streak, bestStreak, totalSubmissions, submissions, feedItems, dareTime, categoryStats, recentSubmissions, submitDare, setCurrentDare, setDareTime }}
    >
      {children}
    </DareContext.Provider>
  );
};