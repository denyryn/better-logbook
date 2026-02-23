import { AuthProvider } from "./auth/auth.provider";
import { UIProvider } from "./ui/ui.provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>{children}</AuthProvider>
    </UIProvider>
  );
}
