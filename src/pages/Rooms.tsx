import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Users, Lock, Globe, Clock, Crown, ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import DareCard from "@/components/DareCard";
import FeedCard from "@/components/FeedCard";
import SubmitModal from "@/components/SubmitModal";
import { useRoom } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";
import { useDare } from "@/context/DareContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GLOBAL_DARE_UNLOCK_LABEL } from "@/lib/constants";

interface RoomSubmission {
  id: string;
  username: string;
  city?: string;
  type: "image" | "video" | "text" | "audio";
  content: string;
  timestamp: string;
}

const Rooms = () => {
  const { rooms, joinRoom, joinedRoomIds } = useRoom();
  const { user } = useAuth();
  const { submitDare } = useDare();
  const [search, setSearch] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [joinMessage, setJoinMessage] = useState<string | null>(null);
  const [roomSubmissions, setRoomSubmissions] = useState<Record<string, RoomSubmission[]>>({});
  const [filterMode, setFilterMode] = useState<"global" | "nearby">("global");

  const publicRooms = rooms.filter(
    (r) => r.visibility === "public" && r.name.toLowerCase().includes(search.toLowerCase())
  );
  const myRooms = rooms.filter((r) => joinedRoomIds.includes(r.id));
  const selectedRoom = myRooms.find((room) => room.id === selectedRoomId) ?? null;
  const submissionsForSelected = selectedRoomId ? roomSubmissions[selectedRoomId] ?? [] : [];
  const filteredSubmissions = submissionsForSelected.filter((item) => {
    if (filterMode === "nearby" && user?.city) {
      return item.city === user.city;
    }
    return true;
  });

  const handleJoinByCode = () => {
    const code = roomCode.trim();
    const targetRoom = rooms.find((room) => room.id === code);
    if (!code) {
      setJoinMessage("Enter a valid room code to join.");
      return;
    }
    if (!targetRoom) {
      setJoinMessage("Room code not found. Check the code and try again.");
      return;
    }
    if (joinedRoomIds.includes(targetRoom.id)) {
      setJoinMessage(`You already joined ${targetRoom.name}.`);
      return;
    }
    if (targetRoom.requiresApproval) {
      setJoinMessage(
        "This room requires approval. Your request has been sent to the admin."
      );
      return;
    }
    joinRoom(targetRoom.id);
    setJoinMessage(`Joined ${targetRoom.name}!`);
    setRoomCode("");
  };

  const handleRoomSubmit = (type: RoomSubmission["type"], content: string) => {
    if (!selectedRoomId) return;
    submitDare(type, content);
    const newSubmission: RoomSubmission = {
      id: `room-${selectedRoomId}-${Date.now()}`,
      username: user?.username ?? "you",
      city: user?.city,
      type,
      content,
      timestamp: "Just now",
    };
    setRoomSubmissions((prev) => ({
      ...prev,
      [selectedRoomId]: [newSubmission, ...(prev[selectedRoomId] ?? [])],
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-14 sm:pb-0">
      <Navbar />
      <main className="w-full max-w-full lg:max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Rooms</h1>
            <p className="text-muted-foreground text-sm mt-1">Enter a room to see its daily dare and unlock submissions.</p>
            <p className="text-sm text-primary/90 mt-2">{GLOBAL_DARE_UNLOCK_LABEL}</p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <Crown className="h-4 w-4" /> {myRooms.length} joined rooms
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-card w-full overflow-hidden">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Have a private room code?</p>
              <p className="text-xs text-muted-foreground mt-1">Enter it here to join a private room instantly.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
              <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Room code"
                className="w-full sm:min-w-0 rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                onClick={handleJoinByCode}
                className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Join Room
              </button>
            </div>
          </div>
          {joinMessage && (
            <p className="mt-3 text-sm text-muted-foreground">{joinMessage}</p>
          )}
        </div>

        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="w-full bg-card border border-border">
            <TabsTrigger value="explore" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Globe className="h-4 w-4" /> Explore
            </TabsTrigger>
            <TabsTrigger value="myrooms" className="flex-1 gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Crown className="h-4 w-4" /> My Rooms
            </TabsTrigger>
          </TabsList>

          {/* Explore Public Rooms */}
          <TabsContent value="explore" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search public rooms..."
                className="w-full rounded-lg border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="grid gap-4">
              {publicRooms.map((room, i) => {
                const joined = joinedRoomIds.includes(room.id);
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-3xl border border-border bg-card p-6 shadow-card hover:-translate-y-0.5 hover:bg-surface-elevated transition-all"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold font-display text-foreground truncate">{room.name}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${room.visibility === "public" ? "bg-primary/10 text-primary" : "bg-muted/80 text-muted-foreground"}`}>
                            {room.visibility}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{room.description}</p>
                      </div>

                      <div className="flex flex-col items-start gap-3 sm:items-end">
                        {joined ? (
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Joined</span>
                        ) : (
                          <button
                            onClick={() => joinRoom(room.id)}
                            className="rounded-full gradient-fire px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                          >
                            Join
                          </button>
                        )}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-4 w-4" /> {room.memberCount}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-4 w-4" /> {room.dareTime}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {publicRooms.length === 0 && (
              <div className="rounded-3xl border border-border bg-muted p-8 text-center">
                <p className="text-lg font-semibold text-foreground">No rooms found</p>
                <p className="mt-2 text-sm text-muted-foreground">Try a broader search or ask an admin for a private room code.</p>
              </div>
            )}
          </TabsContent>

          {/* My Rooms */}
          <TabsContent value="myrooms" className="space-y-4 mt-4">
            {myRooms.length === 0 ? (
              <div className="rounded-3xl border border-border bg-muted p-8 text-center">
                <p className="text-lg font-semibold text-foreground">Create your first room or join one with a code.</p>
                <p className="mt-2 text-sm text-muted-foreground">No joined rooms yet. Use a private room code, or explore public rooms to get started.</p>
              </div>
            ) : selectedRoom ? (
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedRoomId(null)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to joined rooms
                </button>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-primary/70 font-medium">Room</p>
                      <h2 className="text-3xl font-bold font-display text-foreground mt-2">{selectedRoom.name}</h2>
                      {selectedRoom.dareCategory && (
                        <div className="mt-3">
                          <span className="inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                            {selectedRoom.dareCategory}
                          </span>
                        </div>
                      )}
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{selectedRoom.dareText ?? "No dare has been set for this room yet."}</p>
                    </div>
                    <div className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">{selectedRoom.visibility}</div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 mt-6">
                    <div className="rounded-3xl border border-border bg-muted p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Daily Dare</p>
                        {selectedRoom.dareCategory && (
                          <span className="inline-flex text-[10px] font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary whitespace-nowrap flex-shrink-0">
                            {selectedRoom.dareCategory}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-foreground leading-relaxed">{selectedRoom.dareText ?? "No dare has been set for this room yet."}</p>
                    </div>
                    <div className="rounded-3xl border border-border bg-muted p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dare Time</p>
                      <p className="mt-3 text-sm text-foreground">{selectedRoom.dareTime}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-card p-4 mt-6 shadow-inner">
                    <DareCard title="Today's Dare" description={selectedRoom.dareText ?? "No dare has been set for this room yet."} category={selectedRoom.dareCategory} />
                  </div>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-6 w-full rounded-full gradient-fire px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
                  >
                    Submit to {selectedRoom.name}
                  </button>
                </div>

                <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">Room Activity</p>
                      <h3 className="text-lg font-semibold font-display text-foreground mt-2">Submissions</h3>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {submissionsForSelected.length} unlocked
                    </span>
                  </div>

                  {submissionsForSelected.length > 0 && (
                    <div className="mb-4 flex gap-2">
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
                  )}

                  {submissionsForSelected.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center">
                      <p className="text-sm font-semibold text-foreground">Submit to unlock submissions</p>
                      <p className="mt-2 text-sm text-muted-foreground">Your room feed will appear once you've completed today's dare.</p>
                    </div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center">
                      <p className="text-sm font-semibold text-foreground">No nearby submissions</p>
                      <p className="mt-2 text-sm text-muted-foreground">Switch to Global to see submissions from everywhere.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredSubmissions.map((item) => (
                        <FeedCard
                          key={item.id}
                          username={item.username}
                          city={item.city}
                          type={item.type}
                          content={item.content}
                          timestamp={item.timestamp}
                          category={item.category}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold font-display text-foreground">Joined Rooms</h2>
                      <p className="text-sm text-muted-foreground mt-1">Select a room to enter its challenge and unlock the submission feed.</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{myRooms.length} rooms</span>
                  </div>
                </div>

                <div className="grid gap-3 w-full overflow-hidden">
                  {myRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className="w-full max-w-full text-left rounded-3xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:bg-surface-elevated overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-semibold font-display text-foreground truncate">{room.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 truncate">{room.description}</p>
                        </div>
                        <span className="flex-shrink-0 rounded-full bg-muted px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                          {room.visibility}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 sm:gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {room.memberCount} members</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {room.dareTime}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <SubmitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        roomName={selectedRoom?.name}
        onSubmit={handleRoomSubmit}
      />
    </div>
  );
};

export default Rooms;