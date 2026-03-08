import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "better-auth";
import { ProfileState } from "./profile";

interface ProfileHeaderProps {
  user: User | null | undefined;
  onToggleEdit?: () => void;
  profileState: ProfileState;
}

export default function ProfileHeader({user, onToggleEdit, profileState} : ProfileHeaderProps) {
  function getInitials(name: string | undefined) {
    if (!name) return "";
    const names = name.split(" ");
    const initials = names.map((n) => n[0]).join("");
    return initials.toUpperCase();
  }

  if (!user) {
    return (
      <Skeleton className="h-48 w-full" />
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.image || undefined} alt="Profile" />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full">
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{ user.name }</h1>
            </div>
            {/*<p className="text-muted-foreground">Senior Product Designer</p>*/}
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined at {user.createdAt.getMonth() + 1} / {user.createdAt.getFullYear()}
              </div>
            </div>
          </div>
          <Button variant="default" onClick={onToggleEdit} disabled={profileState === "edit"}>Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
