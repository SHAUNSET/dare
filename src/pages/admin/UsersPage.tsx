import { useState } from "react";
import { Users, CircleDot } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";

const roomUserGroups = [
  {
    id: "fit-club",
    name: "Fitness Club",
    description: "Daily movement and healthy streaks.",
    users: [
      { username: "alex_fire", email: "alex@example.com", joined: "2025-01-10", status: "active" },
      { username: "mike_dare", email: "mike@example.com", joined: "2025-02-18", status: "inactive" },
      { username: "kim_brave", email: "kim@example.com", joined: "2025-03-22", status: "active" },
    ],
  },
  {
    id: "creative-crew",
    name: "Creative Crew",
    description: "Art, content, and idea-sharing community.",
    users: [
      { username: "sara_bold", email: "sara@example.com", joined: "2025-02-03", status: "active" },
      { username: "luna_x", email: "luna@example.com", joined: "2025-03-01", status: "active" },
    ],
  },
  {
    id: "night-owls",
    name: "Night Owls",
    description: "Late-night dares and uploads after dark.",
    users: [
      { username: "jay_run", email: "jay@example.com", joined: "2025-03-15", status: "inactive" },
    ],
  },
];

const UsersPage = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(roomUserGroups[0].id);
  const selectedRoom = roomUserGroups.find((room) => room.id === selectedRoomId) ?? roomUserGroups[0];

  const activeCount = selectedRoom.users.filter((user) => user.status === "active").length;
  const inactiveCount = selectedRoom.users.filter((user) => user.status === "inactive").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {roomUserGroups.reduce((sum, room) => sum + room.users.length, 0)} registered users across {roomUserGroups.length} rooms
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">Rooms</p>
                  <h2 className="text-lg font-semibold text-foreground mt-2">Room roster</h2>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{roomUserGroups.length}</div>
              </div>
              <div className="mt-4 space-y-3">
                {roomUserGroups.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full text-left rounded-3xl border px-4 py-4 transition-colors ${
                      selectedRoomId === room.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30 hover:bg-surface-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{room.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{room.users.length} members</p>
                      </div>
                      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                        {room.users.length}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-medium">Selected Room</p>
                  <h2 className="text-2xl font-semibold text-foreground mt-2">{selectedRoom.name}</h2>
                  <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{selectedRoom.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-muted px-4 py-3 text-sm text-foreground border border-border">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Active</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{activeCount}</p>
                  </div>
                  <div className="rounded-3xl bg-muted px-4 py-3 text-sm text-foreground border border-border">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Inactive</p>
                    <p className="mt-2 text-lg font-semibold text-foreground">{inactiveCount}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card shadow-card overflow-hidden">
              <div className="border-b border-border bg-muted px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedRoom.users.length} room members</p>
                    <p className="text-xs text-muted-foreground mt-1">Tap a room to switch context.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <CircleDot className="h-3.5 w-3.5" /> {selectedRoom.id}
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-4 text-muted-foreground font-medium">User</th>
                      <th className="text-left px-6 py-4 text-muted-foreground font-medium">Email</th>
                      <th className="text-left px-6 py-4 text-muted-foreground font-medium">Joined</th>
                      <th className="text-left px-6 py-4 text-muted-foreground font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRoom.users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-muted-foreground">
                          No users have joined this room yet. Share your room to invite people and build activity.
                        </td>
                      </tr>
                    ) : (
                      selectedRoom.users.map((user) => (
                        <tr key={user.username} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                                {user.username[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">@{user.username}</p>
                                <p className="text-xs text-muted-foreground">Member</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                          <td className="px-6 py-4 text-muted-foreground">{user.joined}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                user.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              <span className={`h-2.5 w-2.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-red-500"}`} />
                              {user.status === "active" ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;