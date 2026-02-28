import ProfileHeader from "./_components/profile-header";
import ProfileContent from "./_components/profile-content";

export default function Page() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-10">
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
}
