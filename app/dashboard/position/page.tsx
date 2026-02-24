"use client";

import { useEffect } from "react";
import { usePosition } from "@/app/_providers/resources/position.provider";
import { useCompany } from "@/app/_providers/resources/company.provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PositionDialog } from "../_components/dialog.position";
import { SiteHeader } from "@/components/site-header";

export default function PositionPage() {
  const { positions, isLoading, getPositions } = usePosition();
  const { companies } = useCompany();

  useEffect(() => {
    getPositions();
  }, [getPositions]);

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || "Unknown";
  };

  function RenderContent() {
    switch (true) {
      case isLoading:
        return (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading positions...</p>
          </div>
        );
      case positions.length === 0:
        return (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-muted-foreground">No positions yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first position to get started
            </p>
          </div>
        );
      default:
        return (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell className="font-medium">
                      {position.role || "No Role"}
                    </TableCell>
                    <TableCell>{getCompanyName(position.companyId)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
    }
  }

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-1 items-center justify-end w-full">
              <PositionDialog>
                <Button variant={"outline"} className="gap-2">
                  <IconPlus className="size-4" />
                  Add Position
                </Button>
              </PositionDialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Positions</CardTitle>
              </CardHeader>
              <CardContent>{RenderContent()}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
