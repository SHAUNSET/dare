import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pb-14 sm:pb-0">
      <Navbar />
      <main className="w-full max-w-full lg:max-w-6xl mx-auto px-4 pt-14 sm:pt-16 pb-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;