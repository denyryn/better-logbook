"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AiProvider } from "../_providers/ai/ai.provider";
import { LogbookProvider } from "../_providers/resources/logbook.provider";
import { ProjectProvider } from "../_providers/resources/project.provider";
import { CompanyProvider } from "../_providers/resources/company.provider";
import { TagProvider } from "../_providers/resources/tag.provider";

interface AuthenticatedLayoutProps {
  children?: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <CompanyProvider>
      <ProjectProvider>
        <TagProvider>
          <LogbookProvider>
            <AiProvider>
              <SidebarProvider
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                  } as React.CSSProperties
                }
              >
                <AppSidebar variant="inset" />
                <SidebarInset>{children}</SidebarInset>
              </SidebarProvider>
            </AiProvider>
          </LogbookProvider>
        </TagProvider>
      </ProjectProvider>
    </CompanyProvider>
  );
}
