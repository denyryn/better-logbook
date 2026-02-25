import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { AppBreadcrumb } from "./app-breadcumb";

interface SiteHeaderProps {
  name?: string;
  menu?: React.ReactNode;
  showBreadcrumb?: boolean;
}

export function SiteHeader({
  name,
  menu,
  showBreadcrumb = true,
}: SiteHeaderProps) {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-5"
        />
        {showBreadcrumb ? (
          <AppBreadcrumb />
        ) : (
          <h1 className="flex-1 text-base font-semibold">{name}</h1>
        )}
        <div className="ml-auto flex items-center gap-2">{menu}</div>
      </div>
    </header>
  );
}
