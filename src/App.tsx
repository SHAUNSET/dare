import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DareProvider } from "@/context/DareContext";
import { RoomProvider } from "@/context/RoomContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Rooms from "./pages/Rooms";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageDare from "./pages/admin/ManageDare";
import ManageRooms from "./pages/admin/ManageRooms";
import RoomDetail from "./pages/admin/RoomDetail";
import UsersPage from "./pages/admin/UsersPage";
import SubmissionsPage from "./pages/admin/SubmissionsPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: ReactNode; requiredRole?: "user" | "admin" }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to={user?.role === "admin" ? "/admin" : "/home"} replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) return <Navigate to={user?.role === "admin" ? "/admin" : "/home"} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      {/* Admin onboarding overlay — shown once on first admin login */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/home" element={<ProtectedRoute requiredRole="user"><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requiredRole="user"><Profile /></ProtectedRoute>} />
        <Route path="/friends" element={<ProtectedRoute requiredRole="user"><Friends /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute requiredRole="user"><Rooms /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/dare" element={<ProtectedRoute requiredRole="admin"><ManageDare /></ProtectedRoute>} />
        <Route path="/admin/rooms/:roomId" element={<ProtectedRoute requiredRole="admin"><RoomDetail /></ProtectedRoute>} />
        <Route path="/admin/rooms" element={<ProtectedRoute requiredRole="admin"><ManageRooms /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/submissions" element={<ProtectedRoute requiredRole="admin"><SubmissionsPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <DareProvider>
            <RoomProvider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </RoomProvider>
          </DareProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
