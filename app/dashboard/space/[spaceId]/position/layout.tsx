import { PositionProvider } from "@/app/_providers/resources/position.provider";

export default function PositionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PositionProvider>{children}</PositionProvider>;
}
