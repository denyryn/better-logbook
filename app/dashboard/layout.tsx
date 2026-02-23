"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AiProvider } from "../_providers/ai/ai.provider";
import { LogbookProvider } from "../_providers/resources/logbook.provider";

interface AuthenticatedLayoutProps {
  children?: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
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
  );
}
