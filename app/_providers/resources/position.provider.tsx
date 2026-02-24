"use client";

import { Position } from "@/generated/prisma/client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { PositionService } from "@/services/position";
import { useAuth } from "../auth/auth.provider";
import { status } from "@/lib/api.response";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface PositionContextType {
  positions: Position[];
  isLoading: boolean;
  getPositions: () => Promise<void>;
  addPosition: (position: Partial<Position>) => Promise<void>;
  updatePosition: (position: Partial<Position>) => Promise<void>;
  deletePosition: () => Promise<void>;
}

export const PositionContext = createContext<PositionContextType | null>(null);

export function PositionProvider({ children }: { children: React.ReactNode }) {
  const { spaceId } = useParams<{ spaceId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef<PositionService | null>(null);

  // Initialize service once user is available
  useEffect(() => {
    try {
      if (user?.id && !serviceRef.current) {
        serviceRef.current = new PositionService(user.id, spaceId);
      }
    } finally {
      setIsLoading(false);
      getPositions();
    }
  }, [user, authLoading, spaceId]);

  const getPositions = useCallback(async () => {
    if (!serviceRef.current) return;

    try {
      const response = await serviceRef.current.get();
      if (Array.isArray(response.data)) {
        setPositions(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      toast.error("Failed to fetch positions. Please try again.");
    }
  }, []);

  const addPosition = async (position: Partial<Position>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.post(position);

    if (response.status === status.ERROR) {
      console.error("Failed to add position:", response.message);
      toast.error("Failed to add position. Please try again.");
      return;
    }

    toast.success("Position added successfully!");
    await getPositions();
  };

  const updatePosition = async (position: Partial<Position>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.put(position);

    if (response.status === status.ERROR) {
      console.error("Failed to update position:", response.message);
      toast.error("Failed to update position. Please try again.");
      return;
    }

    toast.success("Position updated successfully!");
    await getPositions();
  };

  const deletePosition = async () => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.delete();

    if (response.status === status.ERROR) {
      console.error("Failed to delete position:", response.message);
      toast.error("Failed to delete position. Please try again.");
      return;
    }

    toast.success("Position deleted successfully!");
    await getPositions();
  };

  return (
    <PositionContext.Provider
      value={{
        positions,
        isLoading,
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
