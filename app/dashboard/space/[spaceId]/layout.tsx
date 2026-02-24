import { PositionProvider } from "@/app/_providers/resources/position.provider";
import { ProjectProvider } from "@/app/_providers/resources/project.provider";

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PositionProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </PositionProvider>
  );
}
