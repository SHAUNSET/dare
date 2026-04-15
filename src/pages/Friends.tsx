import { useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, UserCheck, Trophy, Flame, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const friendsList = [
  { id: "1", username: "alex_fire", streak: 12, submissions: 89, status: "online" as const },
  { id: "2", username: "sara_bold", streak: 8, submissions: 64, status: "online" as const },
  { id: "3", username: "mike_dare", streak: 15, submissions: 102, status: "offline" as const },
  { id: "4", username: "luna_x", streak: 5, submissions: 47, status: "online" as const },
  { id: "5", username: "jay_run", streak: 3, submissions: 31, status: "offline" as const },
];

const pendingRequests = [
  { id: "6", username: "nova_star", mutualFriends: 3 },
  { id: "7", username: "zen_master", mutualFriends: 1 },
];

const leaderboard = [...friendsList].sort((a, b) => b.streak - a.streak);

const Friends = () => {
  const [search, setSearch] = useState("");
  const filteredFriends = friendsList.filter((f) =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold font-display">Friends</h1>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="w-full bg-card border border-border">
            <TabsTrigger value="friends" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Users className="h-4 w-4" /> Friends
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <UserPlus className="h-4 w-4" /> Requests
              {pendingRequests.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-bold">{pendingRequests.length}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Trophy className="h-4 w-4" /> Leaderboard
            </TabsTrigger>
          </TabsList>

          {/* Friends List */}
          <TabsContent value="friends" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search friends..."
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {filteredFriends.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:bg-surface-elevated transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full gradient-fire flex items-center justify-center text-sm font-bold text-primary-foreground font-display">
                      {friend.username[0].toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${friend.status === "online" ? "bg-green-500" : "bg-muted-foreground/40"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">@{friend.username}</p>
                    <p className="text-xs text-muted-foreground">{friend.submissions} submissions</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                  <Flame className="h-4 w-4" />
                  {friend.streak}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* Requests */}
          <TabsContent value="requests" className="space-y-4 mt-4">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending requests</p>
            ) : (
              pendingRequests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold font-display text-secondary-foreground">
                      {req.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">@{req.username}</p>
                      <p className="text-xs text-muted-foreground">{req.mutualFriends} mutual friends</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-lg gradient-fire px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      <UserCheck className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors">
                      Decline
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-3 mt-4">
            {leaderboard.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-surface-elevated transition-colors"
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold font-display ${
                  i === 0 ? "gradient-fire text-primary-foreground" : i === 1 ? "bg-muted-foreground/20 text-foreground" : i === 2 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">@{friend.username}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-bold text-sm">
                    <Flame className="h-4 w-4" />
                    {friend.streak} day streak
                  </div>
                  <p className="text-xs text-muted-foreground">{friend.submissions} total</p>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Friends;