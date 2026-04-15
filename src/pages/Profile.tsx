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

const Profile = () => {
  const { user } = useAuth();
  const { streak, bestStreak, totalSubmissions } = useDare();
  const { rooms, joinedRoomIds } = useRoom();

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

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  const totalActive = heatmapData.filter((d) => d.level > 0).length;

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* User Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full gradient-fire flex items-center justify-center text-2xl font-bold text-primary-foreground font-display">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">@{user?.username}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Joined {user?.joinedDate}</p>
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

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-sm font-semibold font-display">Global Activity Heatmap</h2>
            </div>
            <p className="text-xs text-muted-foreground">{totalActive} active days across all rooms</p>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block">
              <div className="flex ml-8 mb-1">
                {monthLabels.map(({ label, col }, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-muted-foreground"
                    style={{ position: "relative", left: `${col * 13}px`, marginRight: i < monthLabels.length - 1 ? "0" : "0", width: 0, whiteSpace: "nowrap" }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-0">
                <div className="flex flex-col gap-[3px] mr-2 pt-0">
                  {dayLabels.map((label, i) => (
                    <div key={i} className="h-[10px] flex items-center">
                      <span className="text-[10px] text-muted-foreground w-6 text-right">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={`${wi}-${di}`}
                          className={`h-[10px] w-[10px] rounded-[2px] ${day.level < 0 ? "bg-transparent" : levels[day.level]} transition-colors`}
                          title={day.level >= 0 ? `${day.date.toLocaleDateString()}: ${day.level} submissions` : ""}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 justify-end">
                <span className="text-[10px] text-muted-foreground">Less</span>
                {[0, 1, 2, 3, 4].map((l) => (
                  <div key={l} className={`h-[10px] w-[10px] rounded-[2px] ${levels[l]}`} />
                ))}
                <span className="text-[10px] text-muted-foreground">More</span>
              </div>
            </div>
          </div>
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