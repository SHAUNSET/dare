import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Globe, Lock, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { useRoom } from "@/context/RoomContext";
import { useAuth } from "@/context/AuthContext";

const ManageRooms = () => {
  const { rooms, createRoom } = useRoom();
  const { user } = useAuth();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [dareTime, setDareTime] = useState("08:00");

  const adminRooms = rooms.filter((r) => r.adminUsername === user?.username);

  const handleCreate = () => {
    if (!name || !description) return;
    createRoom({ name, description, adminUsername: user?.username || "admin", visibility, dareTime });
    setName("");
    setDescription("");
    setVisibility("public");
    setDareTime("08:00");
    setShowCreate(false);
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
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Room name"
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Room description"
                rows={4}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Visibility</label>
                  <div className="grid w-full grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibility("public")}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        visibility === "public"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground hover:bg-surface-hover"
                      }`}
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
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Daily Dare Time</label>
                  <input
                    type="time"
                    value={dareTime}
                    onChange={(e) => setDareTime(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={!name || !description}
              className="gradient-fire inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add Room
            </button>
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Your Rooms</h2>
            <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">{adminRooms.length} room{adminRooms.length === 1 ? "" : "s"}</span>
          </div>

          {adminRooms.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground shadow-card">
              No rooms have been created under your admin account yet.
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
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{room.description}</p>
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
