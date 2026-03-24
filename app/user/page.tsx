"use client"

import { SiteHeader } from "@/components/site-header";
import Profile from "./_components/profile";

export default function Page() {

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto space-y-6 px-4 py-10">
        <Profile>
          <Profile.Header />
          <Profile.Content />
        </Profile>
      </div>
    </>
  );
}
