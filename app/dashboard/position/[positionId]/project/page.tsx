import { SiteHeader } from "@/components/site-header";
import { useProjects } from "@/lib/query/project.query";

import { ProjectCards } from "./_components/cards.project";

export default function Page() {
  const { data: allProjects } = useProjects();
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ProjectCards projects={allProjects?.data} />
          </div>
        </div>
      </div>
    </>
  );
}
