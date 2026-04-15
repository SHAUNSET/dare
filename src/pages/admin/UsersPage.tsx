import AdminLayout from "@/layouts/AdminLayout";

const dummyUsers = [
  { username: "alex_fire", email: "alex@example.com", joined: "2025-01-10" },
  { username: "sara_bold", email: "sara@example.com", joined: "2025-02-03" },
  { username: "mike_dare", email: "mike@example.com", joined: "2025-02-18" },
  { username: "luna_x", email: "luna@example.com", joined: "2025-03-01" },
  { username: "jay_run", email: "jay@example.com", joined: "2025-03-15" },
  { username: "kim_brave", email: "kim@example.com", joined: "2025-03-22" },
];

const UsersPage = () => (
  <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">{dummyUsers.length} registered users</p>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Username</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Email</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {dummyUsers.map((u) => (
                <tr key={u.username} className="border-b border-border last:border-0 hover:bg-surface-hover transition-colors">
                  <td className="px-5 py-3 font-medium">@{u.username}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
);

export default UsersPage;