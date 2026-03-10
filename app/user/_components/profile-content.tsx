import { Shield, Key, Trash2, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "./profile";
import { cn } from "@/lib/utils";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormData, ProfileSchema } from "@/schemas/profile";
import { FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useEffect } from "react";

export default function ProfileContent() {
  const { user } = useProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    mode: "onBlur",
    defaultValues: {...user}
  });

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <PersonalSection form={form} />
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-6">
        <AccountSection />
      </TabsContent>

      {/* Security Settings */}
      <TabsContent value="security" className="space-y-6">
        <SecuritySection />
      </TabsContent>

      {/* Notification Settings */}
      <TabsContent value="notifications" className="space-y-6">
        <NotificationSection />
      </TabsContent>
    </Tabs>
  );
}

interface SubProfileContentProps {
  form: UseFormReturn<ProfileFormData>
}

function PersonalSection({form}: SubProfileContentProps) {
  const { profileState, user } = useProfile();

  useEffect(() => {
    if (user) form.reset(user);
  }, [user, form]);

  const hiddenButtonState = profileState === "view";
  const formDisabledState = profileState === "view" || form.formState.isSubmitting;

  function onSubmit() {
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Update your personal details and profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldGroup className="col-span-full gap-3">
            <FieldLabel htmlFor="name">
              Full Name
            </FieldLabel>
            <Input
              id="name"
              placeholder="e.g., John Doe, Leon S. Kennedy"
              {...form.register("name")}
              disabled={formDisabledState}
              autoFocus
            />
            {form.formState.errors.name && (
              <FieldDescription className="text-destructive text-sm font-medium">
                {form.formState.errors.name.message}
              </FieldDescription>
            )}
          </FieldGroup>
          <FieldGroup className="col-span-full gap-3">
            <FieldLabel htmlFor="email">
              Email
            </FieldLabel>
            <Input
              id="email"
              placeholder="e.g., leonskennedy@rpd.com"
              {...form.register("email")}
              disabled={formDisabledState}
              autoFocus
            />
            {form.formState.errors.email && (
              <FieldDescription className="text-destructive text-sm font-medium">
                {form.formState.errors.email.message}
              </FieldDescription>
            )}
          </FieldGroup>
          <FieldGroup className="col-span-full gap-3">
            <FieldLabel htmlFor="phone">
              Phone
            </FieldLabel>
            <Input
              id="phone"
              placeholder="e.g., 865123"
              {...form.register("phone")}
              disabled={formDisabledState}
              autoFocus
            />
            {form.formState.errors.phone && (
              <FieldDescription className="text-destructive text-sm font-medium">
                {form.formState.errors.phone.message}
              </FieldDescription>
            )}
          </FieldGroup>

          <div className="flex gap-3 justify-end col-span-full">
            { formDisabledState
              ? <>
                <Button
                  type="reset"
                  className="w-1/4 text-base font-semibold"
                  hidden={hiddenButtonState}
                  disabled
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"secondary"}
                  className="w-1/4 text-base font-semibold"
                  hidden={hiddenButtonState}
                  disabled
                >
                  <LoaderCircle className="animate-spin size-4" />
                  Saving
                </Button>
              </>
              : <>
                <Button
                  type="reset"
                  variant={"secondary"}
                  hidden={hiddenButtonState}
                  className="w-1/4 text-base font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  hidden={hiddenButtonState}
                  className="w-1/4 text-base font-semibold"
                >
                  Save
                </Button>
              </>
            }
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function AccountSection() {
  const { usage } = useProfile();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Weekly AI Usage</CardTitle>
          <CardDescription>Track your AI usage and token consumption.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="w-full text-end">
            { usage }%
          </div>
          <div className="w-full relative">
            <div className="block w-full bg-muted h-6"></div>
            <div className={cn("absolute inset-0 bg-white h-6")} style={{width: `${usage}%` }}></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account preferences and subscription.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Status</Label>
              <p className="text-muted-foreground text-sm">Your account is currently active</p>
            </div>
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
              Active
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Subscription Plan</Label>
              <p className="text-muted-foreground text-sm">Free Plan</p>
            </div>
            <Button variant="outline">Manage Subscription</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Account Visibility</Label>
              <p className="text-muted-foreground text-sm">
                Make your profile visible to other users
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Data Export</Label>
              <p className="text-muted-foreground text-sm">Download a copy of your data</p>
            </div>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Delete Account</Label>
              <p className="text-muted-foreground text-sm">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function SecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Manage your account security and authentication.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Password</Label>
              <p className="text-muted-foreground text-sm">Last changed 3 months ago</p>
            </div>
            <Button variant="outline">
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-muted-foreground text-sm">
                Add an extra layer of security to your account
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                Enabled
              </Badge>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Login Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Get notified when someone logs into your account
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Active Sessions</Label>
              <p className="text-muted-foreground text-sm">
                Manage devices that are logged into your account
              </p>
            </div>
            <Button variant="outline">
              <Shield className="mr-2 h-4 w-4" />
              View Sessions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotificationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose what notifications you want to receive.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">Receive notifications via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">
                Receive push notifications in your browser
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Marketing Emails</Label>
              <p className="text-muted-foreground text-sm">
                Receive emails about new features and updates
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Weekly Summary</Label>
              <p className="text-muted-foreground text-sm">
                Get a weekly summary of your activity
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Security Alerts</Label>
              <p className="text-muted-foreground text-sm">
                Important security notifications (always enabled)
              </p>
            </div>
            <Switch checked disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
