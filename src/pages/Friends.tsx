import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserPlus, UserCheck, Trophy, Flame, Search, Share2, Clipboard, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeedCard from "@/components/FeedCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Friend {
  id: string;
  username: string;
  streak: number;
  submissions: number;
  status: "online" | "offline";
}

interface PendingRequest {
  id: string;
  username: string;
  mutualFriends: number;
}

const initialFriends: Friend[] = [
  { id: "1", username: "alex_fire", streak: 12, submissions: 89, status: "online" },
  { id: "2", username: "sara_bold", streak: 8, submissions: 64, status: "online" },
  { id: "3", username: "mike_dare", streak: 15, submissions: 102, status: "offline" },
  { id: "4", username: "luna_x", streak: 5, submissions: 47, status: "online" },
  { id: "5", username: "jay_run", streak: 3, submissions: 31, status: "offline" },
];

const initialRequests: PendingRequest[] = [
  { id: "6", username: "nova_star", mutualFriends: 3 },
  { id: "7", username: "zen_master", mutualFriends: 1 },
];

const leaderboard = [...initialFriends].sort((a, b) => b.streak - a.streak);

const friendSubmissions: Record<string, { id: string; type: "image" | "video" | "text" | "audio"; content: string; timestamp: string }[]> = {
  "1": [
    { id: "f1-1", type: "text", content: "Completed the morning dare and shared my gratitude list.", timestamp: "3h ago" },
    { id: "f1-2", type: "image", content: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", timestamp: "7h ago" },
  ],
  "2": [
    { id: "f2-1", type: "text", content: "Challenged myself to try a new recipe today.", timestamp: "5h ago" },
  ],
  "3": [
    { id: "f3-1", type: "video", content: "video-placeholder", timestamp: "1d ago" },
  ],
  "4": [
    { id: "f4-1", type: "audio", content: "audio-placeholder", timestamp: "2d ago" },
  ],
  "5": [
    { id: "f5-1", type: "text", content: "Hit a new streak milestone today. Feeling proud!", timestamp: "8h ago" },
  ],
};

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>(initialFriends);
  const [requests, setRequests] = useState<PendingRequest[]>(initialRequests);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredFriends = useMemo(
    () => friends.filter((friend) => friend.username.toLowerCase().includes(search.toLowerCase())),
    [friends, search]
  );

  const selectedFriend = selectedFriendId ? friends.find((friend) => friend.id === selectedFriendId) : null;
  const selectedFeed = selectedFriendId ? friendSubmissions[selectedFriendId] ?? [] : [];

  const handleAccept = (id: string) => {
    const request = requests.find((req) => req.id === id);
    if (!request) return;

    setFriends((prev) => [
      ...prev,
      {
        id: request.id,
        username: request.username,
        streak: 1,
        submissions: 0,
        status: "online",
      },
    ]);
    setSelectedFriendId(request.id);
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const handleReject = (id: string) => setRequests((prev) => prev.filter((req) => req.id !== id));

  return (
    <div className="min-h-screen bg-background pb-14 sm:pb-0">
      <Navbar />
      <main className="w-full max-w-full lg:max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Friends</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage requests, view friend feeds, and share your profile.</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Share2 className="h-4 w-4" /> Share profile
          </div>
        </div>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="w-full bg-card border border-border">
            <TabsTrigger value="friends" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Users className="h-4 w-4" /> Friends
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <UserPlus className="h-4 w-4" /> Requests
              {requests.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 font-bold">{requests.length}</span>
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
                onClick={() => setSelectedFriendId(friend.id)}
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-colors ${
                  selectedFriendId === friend.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-surface-elevated"
                }`}
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
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending requests</p>
            ) : (
              requests.map((req, i) => (
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
                    <button onClick={() => handleAccept(req.id)} className="rounded-lg gradient-fire px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      <UserCheck className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleReject(req.id)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors">
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

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] mt-8">
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Share profile</p>
                  <h2 className="text-xl font-semibold text-foreground">Invite friends to your feed</h2>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-surface-elevated">
                    <Clipboard className="h-4 w-4" /> Copy link
                  </button>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground transition-all hover:bg-surface-elevated">
                    <Share2 className="h-4 w-4" /> Show QR
                  </button>
                </div>
              </div>
              <div className="mt-5 rounded-3xl border border-border bg-muted p-4 text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Your profile link</p>
                <p className="mt-2 break-words text-sm text-foreground">{typeof window !== "undefined" ? `${window.location.origin}/profile/your-username` : "https://app.dare/profile/your-username"}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              {selectedFriend ? (
                <>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Friend feed</p>
                      <h2 className="text-2xl font-semibold text-foreground">@{selectedFriend.username}</h2>
                      <p className="text-sm text-muted-foreground">Recent submissions from this friend.</p>
                    </div>
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {selectedFriend.status === "online" ? "Online now" : "Offline"}
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {selectedFeed.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center">
                        <p className="text-sm font-semibold text-foreground">No submissions yet</p>
                        <p className="mt-2 text-sm text-muted-foreground">This friend has not shared any activity recently.</p>
                      </div>
                    ) : (
                      selectedFeed.map((item) => (
                        <FeedCard
                          key={item.id}
                          username={selectedFriend.username}
                          type={item.type}
                          content={item.content}
                          timestamp={item.timestamp}
                          category={item.category}
                        />
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-border bg-muted p-8 text-center">
                  <p className="text-sm font-semibold text-foreground">Select a friend to view their submissions</p>
                  <p className="mt-2 text-sm text-muted-foreground">Click any accepted friend in the Friends tab to see their activity.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Friends summary</p>
                <h3 className="text-lg font-semibold text-foreground">Active in your circle</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{friends.length} friends</span>
            </div>
            <div className="space-y-3">
              {friends.slice(0, 5).map((friend) => (
                <div key={friend.id} className="flex items-center justify-between rounded-3xl border border-border bg-muted px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full gradient-fire flex items-center justify-center text-sm font-bold text-primary-foreground font-display">
                      {friend.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">@{friend.username}</p>
                      <p className="text-xs text-muted-foreground">{friend.streak}d streak</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFriendId(friend.id)}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:bg-surface-elevated"
                  >
                    View feed
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Friends;