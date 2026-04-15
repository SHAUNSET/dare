import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Lock, Clock, Share2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { useRoom } from "@/context/RoomContext";

const RoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { rooms, updateRoom } = useRoom();
  const room = rooms.find((r) => r.id === roomId);

  const [name, setName] = useState(room?.name ?? "");
  const [dareText, setDareText] = useState(room?.dareText ?? "");
  const [visibility, setVisibility] = useState<"public" | "private">(room?.visibility ?? "public");
  const [dareTime, setDareTime] = useState(room?.dareTime ?? "08:00");
  const [allowAdminView, setAllowAdminView] = useState(room?.allowAdminViewSubmissions ?? false);

  useEffect(() => {
    if (room) {
      setName(room.name);
      setDareText(room.dareText ?? "");
      setVisibility(room.visibility);
      setDareTime(room.dareTime);
      setAllowAdminView(room.allowAdminViewSubmissions ?? false);
    }
  }, [room]);

  if (!room) {
    return (
      <AdminLayout>
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-card">
            <p className="text-muted-foreground">Room not found. Please return to the room list.</p>
            <Link to="/admin/rooms" className="mt-4 inline-flex rounded-lg border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover transition-all">
              Back to Rooms
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleSave = () => {
    updateRoom(room.id, { name, dareText, visibility, dareTime, allowAdminViewSubmissions: allowAdminView });
    navigate("/admin/rooms");
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Edit Room</h1>
            <p className="text-muted-foreground text-sm mt-1">Update room settings and details.</p>
          </div>
          <Link
            to="/admin/rooms"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-hover transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Rooms
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          <div className="text-sm text-muted-foreground">Room ID: {room.id}</div>

          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Room Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">Today's Dare</p>
                <p className="mt-1 text-sm text-foreground">This text will show as the room's active challenge.</p>
              </div>
              <textarea
                value={dareText}
                onChange={(e) => setDareText(e.target.value)}
                rows={5}
                placeholder="Write the daily dare for this room"
                className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Toggle Public / Private</label>
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Edit Daily Dare Time</label>
                  <input
                    type="time"
                    value={dareTime}
                    onChange={(e) => setDareTime(e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
                <div className="rounded-3xl border border-border bg-muted p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Allow admin to view submissions</p>
                      <p className="text-xs text-muted-foreground mt-1">Toggle whether submissions are visible to the room admin.</p>
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
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm text-muted-foreground">
            <div className="rounded-xl border border-border bg-muted p-4">
              <p className="font-semibold text-foreground">Participants</p>
              <p className="mt-1">{room.memberCount} people</p>
            </div>
            <div className="rounded-xl border border-border bg-muted p-4">
              <p className="font-semibold text-foreground">Created</p>
              <p className="mt-1">{room.createdAt}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-primary/5 p-4 text-sm text-primary shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-primary/80">Invite participants</p>
                <p className="mt-2 text-sm text-foreground">Use the room link or QR code to share access to this room.</p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-all">
                <Share2 className="h-4 w-4" /> Copy room link
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Share link</p>
                <p className="mt-2 break-words text-sm text-foreground">{`${window.location.origin}/rooms/${room.id}`}</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">QR code</p>
                <div className="mt-3 h-28 w-full rounded-3xl bg-muted flex items-center justify-center text-xs text-muted-foreground">QR mockup</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="gradient-fire inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Save Changes
          </button>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default RoomDetail;
