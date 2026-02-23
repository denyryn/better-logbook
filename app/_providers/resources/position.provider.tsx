import { Position } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";
import { PositionService } from "@/services/position";
import { useAuth } from "../auth/auth.provider";
import { status } from "@/lib/api.response";
import { toast } from "sonner";

interface PositionContextType {
  positions: Position[];
  getPositions: () => Promise<void>;
  addPosition: (position: Partial<Position>) => Promise<void>;
  updatePosition: (position: Partial<Position>) => Promise<void>;
  deletePosition: () => Promise<void>;
}

export const PositionContext = createContext<PositionContextType | null>(null);

export function PositionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const service = new PositionService(user!.id);
  const [positions, setPositions] = useState<Position[]>([]);

  const getPositions = async () => {
    try {
      const response = await service.get();
      if (Array.isArray(response.data)) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      toast.error("Failed to fetch positions. Please try again.");
    }
  };

  const addPosition = async (position: Partial<Position>) => {
    const response = await service.post(position);

    if (response.status === status.ERROR) {
      console.error("Failed to add position:", response.message);
      toast.error("Failed to add position. Please try again.");
      return;
    }

    toast.success("Position added successfully!");
    getPositions();
  };

  const updatePosition = async (position: Partial<Position>) => {
    const response = await service.put(position);

    if (response.status === status.ERROR) {
      console.error("Failed to update position:", response.message);
      toast.error("Failed to update position. Please try again.");
      return;
    }

    toast.success("Position updated successfully!");
    getPositions();
  };

  const deletePosition = async () => {
    const response = await service.delete();

    if (response.status === status.ERROR) {
      console.error("Failed to delete position:", response.message);
      toast.error("Failed to delete position. Please try again.");
      return;
    }

    toast.success("Position deleted successfully!");
    getPositions();
  };

  return (
    <PositionContext.Provider
      value={{
        positions,
        getPositions,
        addPosition,
        updatePosition,
        deletePosition,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
}

export function usePosition() {
  const context = useContext(PositionContext);
  if (!context) {
    throw new Error("usePosition must be used within a PositionProvider");
  }
  return context;
}
