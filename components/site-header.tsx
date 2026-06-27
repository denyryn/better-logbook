import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { AppBreadcrumb } from "./app-breadcumb";

interface SiteHeaderProps {
  name?: string;
  menu?: React.ReactNode;
  showBreadcrumb?: boolean;
}

// Dell 1996 top banner: black background, white Helvetica Bold, solid black borders
export function SiteHeader({
  name,
  menu,
  showBreadcrumb = true,
}: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-[#000] bg-[#000] text-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1 text-white" />
        <Separator
          orientation="vertical"
          className="mx-1 bg-white data-[orientation=vertical]:h-5"
        />
        {showBreadcrumb ? (
          <AppBreadcrumb />
        ) : (
          <h1 className="flex-1 font-helvetica text-base font-bold">{name}</h1>
        )}
        <div className="ml-auto flex items-center gap-2">{menu}</div>
      </div>
    </header>
  );
}
