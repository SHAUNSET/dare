import { useState } from "react";
import { Trash2 } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";

const initial = [
  { id: "1", user: "alex_fire", content: "Talked to barista about their favorite book", timestamp: "2 hours ago" },
  { id: "2", user: "sara_bold", content: "🖼️ Image submission", timestamp: "4 hours ago" },
  { id: "3", user: "mike_dare", content: "Called an old friend I hadn't spoken to in years", timestamp: "5 hours ago" },
  { id: "4", user: "luna_x", content: "Cold shower at 6 AM", timestamp: "6 hours ago" },
  { id: "5", user: "jay_run", content: "🖼️ Image submission", timestamp: "8 hours ago" },
];

const SubmissionsPage = () => {
  const [subs, setSubs] = useState(initial);

  const handleDelete = (id: string) => setSubs((prev) => prev.filter((s) => s.id !== id));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Submissions</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and moderate user submissions</p>
        </div>

        <div className="space-y-3">
          {subs.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card hover:border-primary/20 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">@{s.user}</span>
                  <span className="text-xs text-muted-foreground">· {s.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{s.content}</p>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="ml-4 rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {subs.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No submissions to review</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubmissionsPage;