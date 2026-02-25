"use client";

import { IconPlus } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePositionsByCompany } from "@/lib/query/position.query";
import {
  useProjectsByCompany,
  useProjectsByPosition,
} from "@/lib/query/project.query";

import { ProjectCards } from "./_components/cards.project";
import { PositionDialog } from "./_components/dialog.position";

export default function Page() {
  const { spaceId } = useParams<{ spaceId: string }>();

  const [activeTab, setActiveTab] = useState("all");
  const { data: companyPositions } = usePositionsByCompany(spaceId);
  const { data: companyProjects } = useProjectsByCompany(spaceId);
  const { data: positionProjects } = useProjectsByPosition(activeTab);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full flex-col justify-start gap-6"
            >
              <div className="flex items-center justify-between">
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                  <TabsTrigger value="all">All</TabsTrigger>

                  {companyPositions?.data.map((position) => (
                    <TabsTrigger key={position.id} value={position.id}>
                      {position.role}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <PositionDialog>
                  <Button variant="outline" size="sm">
                    <IconPlus />
                    <span className="hidden lg:inline">Add Position</span>
                  </Button>
                </PositionDialog>
              </div>

              <TabsContent value="all" className="flex flex-col">
                <div className="aspect-video w-full flex-1 rounded-lg border border-dashed py-4 md:py-6">
                  <ProjectCards projects={companyProjects?.data} />
                </div>
              </TabsContent>

              {companyPositions?.data.map((position) => (
                <TabsContent
                  key={position.id}
                  value={position.id}
                  className="flex flex-col"
                >
                  <div className="aspect-video w-full flex-1 rounded-lg border border-dashed py-4 md:py-6">
                    <ProjectCards
                      key={position.id}
                      projects={positionProjects?.data}
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
