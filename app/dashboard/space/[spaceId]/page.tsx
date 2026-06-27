"use client";

import { IconPlus } from "@tabler/icons-react";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { usePositionsBySpace } from "@/lib/query/position.query";
import { useProjectsBySpace } from "@/lib/query/project.query";

import { ProjectCards } from "./_components/cards.project";
import { PositionDialog } from "./_components/dialog.position";
import { PositionTabsList } from "./_components/tabs.position";

export default function Page() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("position") || "all";

  const [activeTab, setActiveTab] = useState(initialTab);
  const { data: spacePositions } = usePositionsBySpace(spaceId);
  const { data: spaceProjects } = useProjectsBySpace(spaceId);

  const positionProjects = spaceProjects?.data.filter((project) =>
    project.positionId.includes(activeTab),
  );

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <h1 className="sr-only">Space Details</h1>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full flex-col justify-start gap-6"
            >
              <div className="flex items-center justify-between">
                <PositionTabsList positions={spacePositions?.data} />

                <PositionDialog>
                  <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Position</span>
                  </Button>
                </PositionDialog>
              </div>

              <TabsContent value="all" className="flex flex-col">
                <div className="aspect-video w-full flex-1 border border-dashed border-[#000] py-4 md:py-6">
                  <ProjectCards projects={spaceProjects?.data} />
                </div>
              </TabsContent>

              {spacePositions?.data.map((position) => (
                <TabsContent
                  key={position.id}
                  value={position.id}
                  className="flex flex-col"
                >
                  <div className="aspect-video w-full flex-1 rounded-lg border border-dashed py-4 md:py-6">
                    <ProjectCards
                      key={position.id}
                      projects={positionProjects}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
