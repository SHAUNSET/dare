import { useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRoom } from "@/context/RoomContext";
import AdminLayout from "@/layouts/AdminLayout";

interface AdminSubmission {
  id: string;
  user: string;
  content: string;
  timestamp: string;
}

const dummyRoomSubmissions: Record<string, AdminSubmission[]> = {
  r1: [
    { id: "r1-1", user: "alex_fire", content: "Shared a sunrise photo and a gratitude note.", timestamp: "2 hours ago" },
    { id: "r1-2", user: "sara_bold", content: "Captured the morning sky while stretching.", timestamp: "4 hours ago" },
  ],
  r2: [
    { id: "r2-1", user: "fit_guru", content: "Finished 20 burpees and posted a quick clip.", timestamp: "1 hour ago" },
  ],
  r3: [
    { id: "r3-1", user: "mike_dare", content: "Spoke to a barista about their favorite book.", timestamp: "3 hours ago" },
  ],
  r4: [],
  r5: [
    { id: "r5-1", user: "luna_x", content: "Created a bold sketch using just three colors.", timestamp: "5 hours ago" },
  ],
};

const SubmissionsPage = () => {
  const { rooms } = useRoom();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [subs, setSubs] = useState<Record<string, AdminSubmission[]>>(dummyRoomSubmissions);

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId) ?? null;
  const selectedSubmissions = selectedRoomId ? subs[selectedRoomId] ?? [] : [];

  const handleDelete = (roomId: string, id: string) => {
    setSubs((prev) => ({
      ...prev,
      [roomId]: prev[roomId]?.filter((s) => s.id !== id) ?? [],
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Submissions</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and moderate user submissions</p>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-[280px_1fr] w-full overflow-x-hidden overflow-y-visible">
        <div className="space-y-4 min-w-0 max-w-full">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-card w-full overflow-hidden">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Rooms</p>
            <div className="mt-4 space-y-3">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full max-w-full text-left rounded-3xl border px-4 py-4 transition-all overflow-hidden ${
                    selectedRoomId === room.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted hover:border-primary/30 hover:bg-surface-elevated"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{room.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{room.dareText ?? "No dare set yet"}</p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold ${room.allowAdminViewSubmissions ? "bg-primary/10 text-primary" : "bg-muted/80 text-muted-foreground"}`}>
                      {room.allowAdminViewSubmissions ? "Visible" : "Hidden"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 min-w-0 max-w-full">
          {selectedRoom ? (
            <div className="space-y-4 w-full">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-card w-full overflow-hidden">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between w-full">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-primary/70">Room</p>
                    <h2 className="text-2xl font-bold font-display text-foreground mt-2 truncate">{selectedRoom.name}</h2>
                    <p className="mt-3 text-sm text-muted-foreground break-words">{selectedRoom.dareText ?? "No active dare available."}</p>
                  </div>
                  <button
                    onClick={() => setSelectedRoomId(null)}
                    className="flex-shrink-0 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 sm:px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-hover transition-all whitespace-nowrap"
                  >
                    <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to rooms</span><span className="sm:hidden">Back</span>
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 w-full">
                  <div className="rounded-3xl border border-border bg-muted p-4 w-full overflow-hidden">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Submission access</p>
                    <p className="mt-2 text-sm text-foreground">{selectedRoom.allowAdminViewSubmissions ? "Admin can see room submissions." : "Admin submissions view is disabled for this room."}</p>
                  </div>
                  <div className="rounded-3xl border border-border bg-muted p-4 w-full overflow-hidden">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Room visibility</p>
                    <p className="mt-2 text-sm text-foreground">{selectedRoom.visibility.charAt(0).toUpperCase() + selectedRoom.visibility.slice(1)}</p>
                  </div>
                </div>
              </div>

              {selectedRoom.allowAdminViewSubmissions ? (
                <div className="space-y-3 w-full">
                  {selectedSubmissions.length > 0 ? (
                    selectedSubmissions.map((s) => (
                      <div key={s.id} className="rounded-3xl border border-border bg-card p-5 shadow-card w-full max-w-full overflow-hidden">
                      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 min-w-0 w-full">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-foreground truncate">@{s.user}</p>
                          <p className="text-xs text-muted-foreground">{s.timestamp}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(selectedRoom.id, s.id)}
                          className="flex-shrink-0 rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed break-words">{s.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center">
                      <p className="text-sm font-semibold text-foreground">No submissions found for this room.</p>
                      <p className="mt-2 text-sm text-muted-foreground">Nothing has been submitted yet or submissions are still pending.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border border-border bg-muted p-8 text-center">
                  <p className="text-sm font-semibold text-foreground">Submissions are hidden</p>
                  <p className="mt-2 text-sm text-muted-foreground">This room is not currently sharing submissions with admins.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
              <p className="text-sm font-semibold text-foreground">Select a room to see its submissions</p>
              <p className="mt-2 text-sm text-muted-foreground">Only rooms with submission visibility enabled will show entries.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default SubmissionsPage;