import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Globe, Lock, Users, Link as ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { Room, useRoom } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";

const ManageRooms = () => {
  const { rooms, createRoom } = useRoom();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [allowAdminView, setAllowAdminView] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [lastCreatedRoom, setLastCreatedRoom] = useState<Room | null>(null);

  const adminRooms = rooms.filter((r) => r.adminUsername === user?.username);
  const isFreeAdmin = user?.role === "admin" && user?.plan === "free";
  const canCreateRoom = !isFreeAdmin || adminRooms.length === 0;

  const handleCreate = () => {
    if (!name || !canCreateRoom) return;
    const normalizedVisibility = isFreeAdmin ? "private" : visibility;
    const newRoom = createRoom({
      name,
      adminUsername: user?.username || "admin",
      visibility: normalizedVisibility,
      dareTime: "08:00",
      allowAdminViewSubmissions: allowAdminView,
      requiresApproval,
      maxParticipants: maxParticipants,
    });
    setLastCreatedRoom(newRoom);
    setName("");
    setVisibility(isFreeAdmin ? "private" : "public");
    setMaxParticipants(10);
    setAllowAdminView(false);
    setRequiresApproval(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Manage Rooms</h1>
            <p className="text-muted-foreground text-sm mt-1">Create rooms and manage your admin-owned spaces.</p>
          </div>
          <button
            onClick={() => setShowCreate((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg gradient-fire px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Create Room
          </button>
        </div>

        {showCreate && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold font-display">New Room</h2>
                <p className="text-sm text-muted-foreground mt-1">Add a new room that you can manage and edit.</p>
              </div>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-muted p-4">
                <p className="text-sm font-semibold text-foreground">Your admin plan</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isFreeAdmin
                    ? "Free plan limits: 1 room, private only, max 10 participants."
                    : "Pro plan mock: multiple rooms, public rooms, and larger participant pools."}
                </p>
              </div>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Room name"
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-muted p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Room type</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={isFreeAdmin}
                      onClick={() => !isFreeAdmin && setVisibility("public")}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        visibility === "public"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground hover:bg-surface-hover"
                      } ${isFreeAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Globe className="h-4 w-4" /> Public
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibility("private")}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        visibility === "private"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground hover:bg-surface-hover"
                      }`}
                    >
                      <Lock className="h-4 w-4" /> Private
                    </button>
                  </div>
                  {isFreeAdmin && (
                    <p className="mt-2 text-xs text-muted-foreground">Free admins can only create private rooms.</p>
                  )}
                </div>

                <div className="rounded-3xl border border-border bg-muted p-4">
                  <label className="block text-sm font-semibold text-foreground mb-2">Max participants</label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    value={maxParticipants}
                    onChange={(e) => {
                      const value = Math.max(2, Number(e.target.value) || 2);
                      setMaxParticipants(isFreeAdmin ? Math.min(10, value) : value);
                    }}
                    className="w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {isFreeAdmin
                      ? "Free admins are limited to 10 participants."
                      : "Choose the room size your group needs."}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Allow admin to view submissions</p>
                    <p className="text-xs text-muted-foreground mt-1">Enable admin access to member submissions.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAllowAdminView((prev) => !prev)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      allowAdminView ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    {allowAdminView ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Require approval for joins</p>
                    <p className="text-xs text-muted-foreground mt-1">Control whether private room joins are automatic or need approval.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequiresApproval((prev) => !prev)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      requiresApproval ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"
                    }`}
                  >
                    {requiresApproval ? "Required" : "Direct"}
                  </button>
                </div>
              </div>
            </div>
          </div>

            <button
              onClick={handleCreate}
              disabled={!name || !canCreateRoom}
              className="gradient-fire inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create Room
            </button>
            {!canCreateRoom && (
              <p className="text-xs text-destructive mt-2">Free plan admins can only create one room. Upgrade to Pro for additional rooms.</p>
            )}

            {lastCreatedRoom && (
              <div className="rounded-3xl border border-primary/30 bg-primary/5 p-4 text-primary shadow-card">
                <p className="text-sm font-semibold">Room created!</p>
                <p className="text-xs text-muted-foreground mt-1">Share this room with participants using the code, link, or QR option below.</p>
                <div className="mt-4 rounded-3xl border border-border bg-card p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-muted p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Room code</p>
                      <p className="mt-2 break-words text-sm text-foreground">{lastCreatedRoom.id}</p>
                    </div>
                    <div className="rounded-2xl bg-muted p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Participants</p>
                      <p className="mt-2 text-sm text-foreground">{lastCreatedRoom.maxParticipants ?? 10} max</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Share link</p>
                      <p className="mt-2 break-words text-sm text-foreground">{`${window.location.origin}/rooms/${lastCreatedRoom.id}`}</p>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all">
                      <ExternalLink className="h-4 w-4" /> Copy link
                    </button>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">QR code</p>
                      <div className="mt-3 h-28 w-28 rounded-3xl bg-muted flex items-center justify-center text-xs text-muted-foreground">QR mockup</div>
                    </div>
                    <button className="rounded-full bg-muted px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-all">
                      Show QR code
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Rooms</h2>
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">{adminRooms.length} room{adminRooms.length === 1 ? "" : "s"}</span>
          </div>

          {adminRooms.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center shadow-card">
              <p className="text-lg font-semibold text-foreground">Create your first room</p>
              <p className="mt-2 text-sm text-muted-foreground">Start a private space for your participants and share the room code or link.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {adminRooms.map((room, i) => (
                <Link
                  key={room.id}
                  to={`/admin/rooms/${room.id}`}
                  className="block rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-primary/30 hover:bg-surface-elevated"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold font-display text-foreground truncate">{room.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Today's Dare:</span> {room.dareText ?? "Set the room dare inside room details."}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground sm:items-end">
                      <span className={`rounded-full px-2.5 py-1 ${room.visibility === "public" ? "bg-primary/10 text-primary" : "bg-muted/80 text-muted-foreground"}`}>
                        {room.visibility === "public" ? "Public" : "Private"}
                      </span>
                      <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Users className="h-4 w-4" /> {room.memberCount} participants
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Dare at {room.dareTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRooms;
