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
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-5"
        />
        {showBreadcrumb ? (
          <AppBreadcrumb />
        ) : (
          <h1 className="text-base font-semibold flex-1">{name}</h1>
        )}
        <div className="ml-auto flex items-center gap-2">{menu}</div>
      </div>
    </header>
  );
}
