import { motion } from "framer-motion";
import { Flame, Calendar, BarChart3, TrendingUp, Zap, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useDare } from "@/context/DareContext";
import { useRoom } from "@/context/RoomContext";

// Generate realistic heatmap data for the last 365 days
const generateHeatmap = () => {
  const days = [];
  const now = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay();
    // More likely to have activity on weekdays, recent dates more active
    const recencyBoost = (365 - i) / 365;
    const weekendPenalty = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
    const chance = 0.3 + recencyBoost * 0.4;
    const active = Math.random() < chance * weekendPenalty;
    days.push({
      date: d,
      level: active ? Math.floor(Math.random() * 4) + 1 : 0,
    });
  }
  return days;
};

const heatmapData = generateHeatmap();

const levels: Record<number, string> = {
  0: "bg-muted/50",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/60",
  4: "bg-primary/80",
};

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const insights = [
  {
    title: "Streak consistency",
    description: "You complete 83% of your daily dares on time, keeping your progress steady.",
    highlight: "84% consistency",
    icon: TrendingUp,
  },
  {
    title: "Participation level",
    description: "Your engagement stays strong during social and creative challenges.",
    highlight: "High engagement",
    icon: Zap,
  },
  {
    title: "Behavioral pattern",
    description: "You prefer collaborative dares with friends, especially during evenings.",
    highlight: "Social challenger",
    icon: HeartHandshake,
  },
];

// AI Insights generation
const generatePersonalityTag = (categoryStats: Record<string, number>, streak: number): string => {
  const categories = Object.entries(categoryStats).sort(([, a], [, b]) => b - a);
  const dominant = categories[0]?.[0] || "Challenger";
  
  if (streak >= 10 && dominant === "Social") return "The Social Powerhouse";
  if (streak >= 10 && dominant === "Physical") return "The Consistent Builder";
  if (streak >= 10 && dominant === "Mental") return "The Thoughtful Challenger";
  if (dominant === "Social") return "The Social Explorer";
  if (dominant === "Physical") return "The Bold Achiever";
  if (dominant === "Mental") return "The Silent Improver";
  if (dominant === "Personal") return "The Self-Discoverer";
  return "The Challenger";
};

const generateAIInsights = (categoryStats: Record<string, number>, streak: number, totalSubmissions: number): Array<{ title: string; text: string }> => {
  const insights: Array<{ title: string; text: string }> = [];
  
  const entries = Object.entries(categoryStats).sort(([, a], [, b]) => b - a);
  const [dominant, dominantCount] = entries[0] || ["Physical", 0];
  const [weakest, weakestCount] = entries[entries.length - 1] || ["Social", 0];
  
  // Insight 1: Dominant category
  insights.push({
    title: "Your Strength",
    text: `You excel in ${dominant} challenges with ${dominantCount} completions. This shows your strong ${dominant.toLowerCase()} abilities and commitment.`,
  });
  
  // Insight 2: Weakest category
  if (weakestCount < dominantCount * 0.5) {
    insights.push({
      title: "Growth Opportunity",
      text: `${weakest} dares account for only ${weakestCount} completions. Exploring this category could round out your skills and create a more balanced growth profile.`,
    });
  }
  
  // Insight 3: Consistency
  if (streak >= 10) {
    insights.push({
      title: "Consistency Champion",
      text: `Your ${streak}-day streak shows exceptional dedication. You're building a habit that compounds over time. Keep this momentum!`,
    });
  } else if (streak >= 5) {
    insights.push({
      title: "Building Momentum",
      text: `Your ${streak}-day streak is growing strong. A few more consistent days and you'll reach 10 days. You're on the right track!`,
    });
  }
  
  // Insight 4: Volume-based
  if (totalSubmissions >= 40) {
    insights.push({
      title: "High Engagement",
      text: `With ${totalSubmissions} total submissions, you're a top performer. Your dedication is inspiring others in the community.`,
    });
  }
  
  // Insight 5: Trend insight
  insights.push({
    title: "Recommended Focus",
    text: `Try more ${weakest} challenges to balance your growth and unlock new capabilities you haven't explored yet.`,
  });
  
  return insights.slice(0, 3); // Return top 3 insights
};

const Profile = () => {
  console.log("Profile loaded");
  const { user } = useAuth();
  const { streak, bestStreak, totalSubmissions, categoryStats, recentSubmissions } = useDare();
  const { rooms, joinedRoomIds } = useRoom();

  const personalityTag = generatePersonalityTag(categoryStats, streak);
  const aiInsights = generateAIInsights(categoryStats, streak, totalSubmissions);

  const joinedRooms = rooms.filter((room) => joinedRoomIds.includes(room.id));
  const roomBreakdown = joinedRooms.map((room, index) => ({
    ...room,
    participation: Math.min(96, 45 + ((room.name.length * 7 + index * 14) % 50)),
  }));
  const averageParticipation = roomBreakdown.length
    ? Math.round(roomBreakdown.reduce((sum, item) => sum + item.participation, 0) / roomBreakdown.length)
    : 0;

  // Group heatmap by weeks (columns) with 7 rows (Sun-Sat)
  const weeks: typeof heatmapData[0][][] = [];
  let currentWeek: typeof heatmapData[0][] = [];

  // Pad start to align to Sunday
  const firstDay = heatmapData[0].date.getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({ date: new Date(0), level: -1 }); // placeholder
  }

  heatmapData.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push({ date: new Date(0), level: -1 });
    weeks.push(currentWeek);
  }

  // Month labels positioned at the right week
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const validDay = week.find((d) => d.level >= 0);
    if (validDay && validDay.date.getMonth() !== lastMonth) {
      lastMonth = validDay.date.getMonth();
      monthLabels.push({ label: months[lastMonth], col: wi });
    }
  });

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const totalActive = heatmapData.filter((d) => d.level > 0).length;

  return (
    <div className="w-full min-h-screen bg-background pb-14 sm:pb-0">
      <Navbar />
      <main className="w-full max-w-6xl mx-auto px-4 pt-20 sm:pt-20 pb-8 space-y-8">
        {/* User Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full gradient-fire flex items-center justify-center text-2xl font-bold text-primary-foreground font-display">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-xl font-bold font-display">@{user?.username}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Joined {user?.joinedDate}</p>
                <div className="mt-2 inline-block">
                  <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    {personalityTag}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { icon: Flame, label: "Current Streak", value: `${streak} days`, color: "text-primary" },
            { icon: Flame, label: "Best Streak", value: `${bestStreak} days`, color: "text-streak-glow" },
            { icon: BarChart3, label: "Total Submissions", value: totalSubmissions.toString(), color: "text-foreground" },
          ].map(({ icon: Icon, label, value, color }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-card text-center">
              <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-bold font-display">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {insights.map((insight) => (
            <motion.div key={insight.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <insight.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.highlight}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Category-Wise Progress */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold font-display text-foreground">Category Breakdown</h2>
              <p className="text-sm text-muted-foreground mt-1">Your progress across challenge categories</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(["Social", "Mental", "Physical", "Personal", "Life"] as const).map((category) => {
              const count = categoryStats[category] || 0;
              const total = Object.values(categoryStats).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const categoryColors: Record<string, { bg: string; text: string; progress: string }> = {
                Social: { bg: "bg-blue-500/10", text: "text-blue-600", progress: "bg-blue-500" },
                Mental: { bg: "bg-purple-500/10", text: "text-purple-600", progress: "bg-purple-500" },
                Physical: { bg: "bg-orange-500/10", text: "text-orange-600", progress: "bg-orange-500" },
                Personal: { bg: "bg-green-500/10", text: "text-green-600", progress: "bg-green-500" },
                Life: { bg: "bg-pink-500/10", text: "text-pink-600", progress: "bg-pink-500" },
              };
              const colors = categoryColors[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${colors.bg} rounded-2xl p-4 text-center border border-border/50`}
                >
                  <p className={`text-sm font-semibold ${colors.text} mb-2`}>{category}</p>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
                  <div className="mt-3 h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div className={`h-full rounded-full ${colors.progress} transition-all`} style={{ width: `${percentage}%` }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold font-display">Global Activity Heatmap</h2>
            </div>
            <p className="text-xs text-muted-foreground">{totalActive} active days across all rooms</p>
          </div>

          <div className="w-full overflow-x-auto pb-4">
            <div className="inline-block min-w-full">
              <div className="flex gap-1 mb-2 pl-12">
                {monthLabels.map(({ label }, i) => (
                  <span key={i} className="text-[8px] sm:text-[9px] text-muted-foreground w-12 font-medium">
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-1">
                <div className="flex flex-col gap-[2px] w-10">
                  {dayLabels.map((label, i) => (
                    <div key={i} className="h-3 sm:h-4 flex items-center justify-end pr-2">
                      <span className="text-[6px] sm:text-[9px] text-muted-foreground font-medium">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[2px]">
                      {week.map((day, di) => (
                        <div
                          key={`${wi}-${di}`}
                          className={`h-3 w-3 sm:h-4 sm:w-4 rounded cursor-pointer hover:opacity-80 transition-all ${day.level < 0 ? "bg-transparent" : levels[day.level]}`}
                          title={day.level >= 0 ? `${day.date.toLocaleDateString()}: ${day.level} submissions` : ""}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pl-12">
                <span className="text-[6px] sm:text-[9px] text-muted-foreground text-nowrap">Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} className={`h-2 w-2 sm:h-3 sm:w-3 rounded ${levels[l]}`} />
                ))}
                <span className="text-[6px] sm:text-[9px] text-muted-foreground text-nowrap">More</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Growth Insights */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold font-display text-foreground">Your Growth Insights</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {aiInsights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10 p-4"
              >
                <p className="text-sm font-semibold text-foreground mb-2">{insight.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5">
            <h2 className="text-lg font-semibold font-display text-foreground">Recent Activity</h2>
            <p className="text-sm text-muted-foreground mt-1">Your last 5 submissions</p>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center">
              <p className="text-sm font-semibold text-foreground">No submissions yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Start by submitting to today's dare!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-border/50 bg-muted/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">@{submission.username}</p>
                      <p className="text-xs text-muted-foreground mt-1">{submission.timestamp}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium flex-shrink-0">
                      {submission.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{submission.content}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold font-display text-foreground">Rooms Breakdown</h2>
              <p className="text-sm text-muted-foreground mt-1">See contribution trends across your joined rooms.</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Average {averageParticipation}%</span>
          </div>

          {roomBreakdown.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-muted p-6 text-center text-sm text-muted-foreground">
              You haven’t joined any rooms yet. Join a room to start tracking room-level participation.
            </div>
          ) : (
            <div className="space-y-4">
              {roomBreakdown.map((room) => (
                <div key={room.id} className="rounded-3xl border border-border bg-muted p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{room.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{room.memberCount} members</p>
                    </div>
                    <span className="text-xs font-semibold text-foreground">{room.participation}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${room.participation}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;