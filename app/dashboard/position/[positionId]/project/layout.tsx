import { ProjectProvider } from "@/app/_providers/resources/project.provider";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectProvider>{children}</ProjectProvider>;
}
