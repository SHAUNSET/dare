import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Room {
  id: string;
  name: string;
  description?: string;
  dareText?: string;
  dareCategory?: "Social" | "Mental" | "Physical" | "Personal" | "Life";
  allowAdminViewSubmissions?: boolean;
  requiresApproval?: boolean;
  maxParticipants?: number;
  adminUsername: string;
  visibility: "public" | "private";
  memberCount: number;
  dareTime: string; // e.g. "08:00"
  createdAt: string;
}

interface RoomContextType {
  rooms: Room[];
  createRoom: (room: Omit<Room, "id" | "createdAt" | "memberCount">) => Room;
  updateRoom: (roomId: string, updates: Partial<Omit<Room, "id" | "adminUsername" | "createdAt" | "memberCount">>) => void;
  joinRoom: (roomId: string) => void;
  joinedRoomIds: string[];
}

const dummyRooms: Room[] = [
  { id: "r1", name: "Morning Warriors", description: "Daily dares at sunrise. Push your limits before the world wakes up.", dareText: "Share a sunrise photo and say one thing you are grateful for.", dareCategory: "Life", allowAdminViewSubmissions: true, adminUsername: "admin_alex", visibility: "public", memberCount: 234, dareTime: "06:00", createdAt: "2025-12-01" },
  { id: "r2", name: "Fitness Freaks", description: "Physical challenges only. Cold showers, runs, workouts.", dareText: "Complete 20 burpees and post a short clip.", dareCategory: "Physical", allowAdminViewSubmissions: false, adminUsername: "fit_guru", visibility: "public", memberCount: 512, dareTime: "07:00", createdAt: "2025-11-15" },
  { id: "r3", name: "Social Butterflies", description: "Dares focused on talking to strangers and social skills.", dareText: "Talk to someone new today and share how it went.", dareCategory: "Social", allowAdminViewSubmissions: true, adminUsername: "social_sara", visibility: "public", memberCount: 189, dareTime: "12:00", createdAt: "2026-01-10" },
  { id: "r4", name: "Night Owls", description: "Late night challenges for the brave.", dareText: "Write a midnight poem or capture a night sky photo.", dareCategory: "Personal", allowAdminViewSubmissions: false, adminUsername: "owl_mike", visibility: "public", memberCount: 97, dareTime: "22:00", createdAt: "2026-02-20" },
  { id: "r5", name: "Creative Chaos", description: "Art, writing, music — creative dares daily.", dareText: "Create something bold with only three colors.", dareCategory: "Mental", allowAdminViewSubmissions: true, adminUsername: "art_luna", visibility: "public", memberCount: 341, dareTime: "10:00", createdAt: "2026-03-05" },
];

const RoomContext = createContext<RoomContextType | null>(null);

export const useRoom = () => {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
};

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>(dummyRooms);
  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>(["r1"]);

  const createRoom = (room: Omit<Room, "id" | "createdAt" | "memberCount">) => {
    const newRoom: Room = {
      ...room,
      allowAdminViewSubmissions: room.allowAdminViewSubmissions ?? false,
      requiresApproval: room.requiresApproval ?? false,
      maxParticipants: room.maxParticipants,
      id: `r-${Date.now()}`,
      memberCount: 1,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setRooms((prev) => [newRoom, ...prev]);
    setJoinedRoomIds((prev) => [newRoom.id, ...prev]);
    return newRoom;
  };

  const updateRoom = (
    roomId: string,
    updates: Partial<Omit<Room, "id" | "adminUsername" | "createdAt" | "memberCount">>,
  ) => {
    setRooms((prev) => prev.map((room) => (room.id === roomId ? { ...room, ...updates } : room)));
  };

  const joinRoom = (roomId: string) => {
    if (!joinedRoomIds.includes(roomId)) {
      setJoinedRoomIds((prev) => [...prev, roomId]);
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, memberCount: r.memberCount + 1 } : r))
      );
    }
  };

  return (
    <RoomContext.Provider value={{ rooms, createRoom, updateRoom, joinRoom, joinedRoomIds }}>
      {children}
    </RoomContext.Provider>
  );
};
