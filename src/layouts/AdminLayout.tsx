import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-0">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-10 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;