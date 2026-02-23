import { Tag } from "@/generated/prisma/client";
import { createContext, useContext, useState } from "react";
import { TagService } from "@/services/tag";
import { status } from "@/lib/api.response";
import { toast } from "sonner";

interface TagContextType {
  tags: Tag[];
  getTags: () => Promise<void>;
  addTag: (tag: Partial<Tag>) => Promise<void>;
  updateTag: (tagId: string, tag: Partial<Tag>) => Promise<void>;
}

export const TagContext = createContext<TagContextType | null>(null);

export function TagProvider({ children }: { children: React.ReactNode }) {
  const service = new TagService();
  const [tags, setTags] = useState<Tag[]>([]);

  const getTags = async () => {
    try {
      const response = await service.get();
      if (response.data && response.data.tags) {
        setTags(response.data.tags);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      toast.error("Failed to fetch tags. Please try again.");
    }
  };

  const addTag = async (tag: Partial<Tag>) => {
    const response = await service.post(tag);

    if (response.status === status.ERROR) {
      console.error("Failed to add tag:", response.message);
      toast.error("Failed to add tag. Please try again.");
      return;
    }

    toast.success("Tag added successfully!");
    getTags();
  };

  const updateTag = async (tagId: string, tag: Partial<Tag>) => {
    const response = await service.put(tagId, tag);

    if (response.status === status.ERROR) {
      console.error("Failed to update tag:", response.message);
      toast.error("Failed to update tag. Please try again.");
      return;
    }

    toast.success("Tag updated successfully!");
    getTags();
  };

  return (
    <TagContext.Provider value={{ tags, getTags, addTag, updateTag }}>
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
