"use client"

import ProfileHeader from "./_components/profile-header";
import ProfileContent from "./_components/profile-content";
import { useSession } from "@/lib/auth-client";

export default function Page() {
  const {data: authSession} = useSession();

  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <ProfileHeader name={authSession?.user.name} email={authSession?.user.email} joinedAt={authSession?.user.createdAt} />
      <ProfileContent />
    </div>
  );
}
