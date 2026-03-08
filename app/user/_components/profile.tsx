import ProfileContent from "./profile-content";
import { createContext, useContext, useState } from "react";
import ProfileHeader from "./profile-header";
import { useAuth } from "@/app/_providers/auth/auth.provider";
import { useAiUsage } from "@/lib/query/ai-usage.query";
import { TokenCalculator } from "@/lib/ai/token.calculator";

export type ProfileState = "edit" | "view";

interface ProfileContextValue {
  profileState: ProfileState;
  setProfileState: React.Dispatch<React.SetStateAction<ProfileState>>;
  user: ReturnType<typeof useAuth>["user"];
  usage?: number;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

/* ---------------- Hook ---------------- */

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within Profile");
  }

  return context;
}

/* ---------------- Sub Components ---------------- */

function Content() {
  return <ProfileContent />
}

function Header() {
  const { user, profileState, setProfileState } = useProfile();

  const handleEditClick = () => {
    setProfileState(prev => (prev === "view" ? "edit" : "view"));
  };

  return <ProfileHeader user={user} onToggleEdit={handleEditClick} profileState={profileState} />;
}

/* ---------------- Compound Component Type ---------------- */

interface ProfileComponent extends React.FC<{ children: React.ReactNode }> {
  Content: typeof Content;
  Header: typeof Header;
}

/* ---------------- Root Component ---------------- */

const Profile = (({ children }: { children: React.ReactNode }) => {
  const [profileState, setProfileState] = useState<ProfileState>("view");
  const { user } = useAuth();
  const { data: aiUsageDatas } = useAiUsage();

  const tokens = new TokenCalculator(aiUsageDatas?.data)
  const usage = tokens.calculateUsagePercentage();

  return (
    <ProfileContext.Provider value={{ profileState, setProfileState, user, usage }}>
      {children}
    </ProfileContext.Provider>
  );
}) as ProfileComponent;

/* ---------------- Attach Sub Components ---------------- */

Profile.Content = Content;
Profile.Header = Header;

export default Profile;
