import { Tag } from "@/generated/prisma/client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { TagService } from "@/services/tag";
import { useAuth } from "../auth/auth.provider";
import { status } from "@/lib/api.response";
import { toast } from "sonner";

interface TagContextType {
  tags: Tag[];
  isLoading: boolean;
  getTags: () => Promise<void>;
  addTag: (tag: Partial<Tag>) => Promise<void>;
  updateTag: (tagId: string, tag: Partial<Tag>) => Promise<void>;
}

export const TagContext = createContext<TagContextType | null>(null);

export function TagProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const serviceRef = useRef<TagService | null>(null);

  // Initialize service once user is available
  useEffect(() => {
    try {
      if (user?.id && !serviceRef.current) {
        serviceRef.current = new TagService();
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  const getTags = async () => {
    if (!serviceRef.current) return;

    try {
      const response = await serviceRef.current.get();
      if (response.data && response.data.tags) {
        setTags(response.data.tags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      toast.error("Failed to fetch tags. Please try again.");
    }
  };

  const addTag = async (tag: Partial<Tag>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.post(tag);

    if (response.status === status.ERROR) {
      console.error("Failed to add tag:", response.message);
      toast.error("Failed to add tag. Please try again.");
      return;
    }

    toast.success("Tag added successfully!");
    await getTags();
  };

  const updateTag = async (tagId: string, tag: Partial<Tag>) => {
    if (!serviceRef.current) {
      toast.error("User not authenticated");
      return;
    }

    const response = await serviceRef.current.put(tagId, tag);

    if (response.status === status.ERROR) {
      console.error("Failed to update tag:", response.message);
      toast.error("Failed to update tag. Please try again.");
      return;
    }

    toast.success("Tag updated successfully!");
    await getTags();
  };

  return (
    <TagContext.Provider
      value={{ tags, isLoading, getTags, addTag, updateTag }}
    >
      {children}
    </TagContext.Provider>
  );
}

export function useTag() {
  const context = useContext(TagContext);
  if (!context) {
    throw new Error("useTag must be used within a TagProvider");
  }
  return context;
}
