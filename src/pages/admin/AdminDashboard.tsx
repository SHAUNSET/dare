import { Users, FileText, Activity, Layers, TrendingUp, BarChart3 } from "lucide-react";
import { useRoom } from "@/context/RoomContext";
import { useDare } from "@/context/DareContext";
import StatCard from "@/components/StatCard";
import AdminLayout from "@/layouts/AdminLayout";

const activityLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const participationBars = [72, 84, 66, 95, 88, 76, 103];

const AdminDashboard = () => {
  const { rooms } = useRoom();
  const { totalSubmissions } = useDare();

  const totalRooms = rooms.length;
  const totalParticipants = rooms.reduce((sum, room) => sum + room.memberCount, 0);
  const activeRooms = rooms.filter((room) => room.memberCount > 0).length;

  const topRooms = [...rooms]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of DARE platform performance and room activity.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <StatCard icon={Layers} label="Total Rooms" value={totalRooms} />
          <StatCard icon={Users} label="Total Users" value={1284} />
          <StatCard icon={FileText} label="Total Submissions" value={totalSubmissions} />
          <StatCard icon={Activity} label="Active Rooms" value={activeRooms} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Room activity</p>
                <h2 className="text-lg font-bold text-foreground">Weekly engagement</h2>
              </div>
              <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Live</div>
            </div>

            <div className="mt-6 space-y-3">
              {activityLabels.map((label, index) => {
                const value = [62, 78, 54, 84, 91, 68, 73][index];
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-10 text-xs text-muted-foreground">{label}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-foreground">{value}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Participation trend</p>
                <h2 className="text-lg font-bold text-foreground">Member growth</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <TrendingUp className="h-3.5 w-3.5" /> +12%
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {participationBars.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-muted-foreground">Day {index + 1}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, value)}%` }} />
                  </div>
                  <span className="w-12 text-right text-xs font-semibold text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Room performance</p>
                <h2 className="text-lg font-bold text-foreground">Top rooms</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>

            <div className="mt-6 space-y-4">
              {topRooms.map((room) => (
                <div key={room.id} className="rounded-2xl border border-border bg-muted p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate">{room.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{room.description}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{room.visibility}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{room.memberCount} participants</span>
                    <span>{room.dareTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Activity snapshot</p>
                <h2 className="text-lg font-bold text-foreground">Performance overview</h2>
              </div>
              <div className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Updated now</div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total participants</span>
                  <span className="text-foreground font-semibold">{totalParticipants}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, totalParticipants / 5)}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Engaged rooms</span>
                  <span className="text-foreground font-semibold">{activeRooms}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, (activeRooms / totalRooms) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
