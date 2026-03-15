import { Shield, Key, Trash2, LoaderCircle, KeyIcon } from "lucide-react";

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
import { useEffect, useState } from "react";
import { useCreatePasskey, useDeletePasskey, useDeleteSession, usePasskeys, useSessions } from "@/lib/query/auth.query";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AlertModal } from "@/components/alert-modal";
import { Modal } from "@/components/modal";
import { clientDevice } from "@/lib/client-device";
import { useAuth } from "@/app/_providers/auth/auth.provider";

export default function ProfileContent() {
  const { user } = useProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    mode: "onSubmit",
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

  function resetForm() {
    if (!user) return;
    form.reset(user);
  }

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

          <div className="flex gap-3 justify-end col-span-full">
            { formDisabledState
              ? <>
                <Button
                  type="button"
                  className="w-1/8 text-base font-semibold"
                  hidden={hiddenButtonState}
                  onClick={resetForm}
                  disabled
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"secondary"}
                  className="w-1/8 text-base font-semibold"
                  hidden={hiddenButtonState}
                  disabled
                >
                  <LoaderCircle className="animate-spin size-4" />
                  Saving
                </Button>
              </>
              : <>
                <Button
                  type="button"
                  variant={"secondary"}
                  hidden={hiddenButtonState}
                  onClick={resetForm}
                  className="w-1/8 text-base font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  hidden={hiddenButtonState}
                  className="w-1/8 text-base font-semibold"
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
            <div className="block w-full bg-muted h-6 rounded"></div>
            <div className={cn("absolute inset-0 bg-white h-6 rounded")} style={{width: `${usage}%` }}></div>
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
  const { data: passkeys, isLoading: isPasskeyLoading } = usePasskeys();
  const { mutate: createPasskey, isPending: isCreatePasskeyPending } = useCreatePasskey();
  const { mutate: deletePasskey } = useDeletePasskey();

  const { data: sessions, isLoading: isSessionsLoading } = useSessions();
  const { mutate: deleteSession } = useDeleteSession();

  const PasskeySection = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [deletionTarget, setDeletionTarget] = useState("");

    function deletionAttempt(passkeyId: string) {
      setDeletionTarget(passkeyId);
      setModalOpen(true);
    }

    const DeletionAlert = () => {
      return (
        <AlertModal open={modalOpen} onOpenChange={setModalOpen}>
          <AlertModal.Content>
            <AlertModal.Header>
              <AlertModal.Title>
                Remove Passkey
              </AlertModal.Title>
            </AlertModal.Header>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will remove your passkey.
            </p>
            <AlertModal.Footer>
              <AlertModal.Cancel>
                Cancel
              </AlertModal.Cancel>
              <AlertModal.Action variant={"destructive"} onClick={() => deletePasskey(deletionTarget)}>
                Continue
              </AlertModal.Action>
            </AlertModal.Footer>
          </AlertModal.Content>
        </AlertModal>
      )
    }

    if (isPasskeyLoading) {
      return (
        <Skeleton className="h-30 w-full" />
      );
    }

    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Passkeys</Label>
              <p className="text-muted-foreground text-sm">
                Use biometric authentication for faster and more secure logins
              </p>
            </div>
            <Button variant="outline" onClick={() => createPasskey()} disabled={isCreatePasskeyPending}>
              {isCreatePasskeyPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {!isCreatePasskeyPending && <KeyIcon className="mr-2 h-4 w-4" />}
              Add Passkey
            </Button>
          </div>
          {passkeys && passkeys.length > 0 && passkeys.map((passkey) => (
            <div key={passkey.id} className="mt-2 border rounded-md p-4 flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">
                  {passkey.id}
                </Label>
                <p className="text-muted-foreground text-sm">
                  Registered on { format(new Date(passkey.createdAt), "dd MMMM yyyy")  }
                </p>
              </div>
              <Button variant="destructive" onClick={() => deletionAttempt(passkey.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          ))}
        </div>

        <DeletionAlert />
      </>
    )
  }

  const SessionSection = () => {
    const { session: currentSession } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [deletionTarget, setDeletionTarget] = useState("");

    function deletionAttempt(tokenId: string) {
      setDeletionTarget(tokenId);
      setAlertOpen(true);
    }

    const ListModal = () => {
      return (
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>
                Session List
              </Modal.Title>
              <Modal.Description>
                Manage your active sessions.
              </Modal.Description>
            </Modal.Header>

            {sessions && sessions?.length > 0 && sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 border rounded-lg bg-background hover:bg-muted/40 transition-colors flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-base font-medium">
                    {clientDevice.name(session?.userAgent)}
                  </span>

                  <div className="text-sm text-muted-foreground flex flex-col gap-0.5">
                    <span>
                      Created <span className="opacity-70">·</span>{" "}
                      {format(session.createdAt, "dd MMM yyyy")}
                    </span>

                    <span>
                      Expires <span className="opacity-70">·</span>{" "}
                      {format(session.expiresAt, "dd MMM yyyy")}
                    </span>
                  </div>
                </div>

                <Button variant={"destructive"} onClick={() => deletionAttempt(session.token)} hidden={session.token === currentSession?.token}>
                  Remove
                </Button>
              </div>
            ))}
          </Modal.Content>
        </Modal>
      )
    }

    const DeletionAlert = () => {
      return (
        <AlertModal open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertModal.Content>
            <AlertModal.Header>
              <AlertModal.Title>
                Are you absolutely sure to remove this session?
              </AlertModal.Title>
              <AlertModal.Description>
                The action cannot be undone. The selected session will be removed.
              </AlertModal.Description>
            </AlertModal.Header>
            <AlertModal.Footer>
              <AlertModal.Cancel>
                Cancel
              </AlertModal.Cancel>
              <AlertModal.Action variant={"destructive"} onClick={() => deleteSession(deletionTarget)}>
                Continue
              </AlertModal.Action>
            </AlertModal.Footer>
          </AlertModal.Content>
        </AlertModal>
      )
    }

    return (
      <>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base">Active Sessions</Label>
            <p className="text-muted-foreground text-sm">
              Manage devices that are logged into your account
            </p>
          </div>
          <Button variant="outline" onClick={() => setModalOpen(true)}>
            <Shield className="mr-2 h-4 w-4" />
            View Sessions
          </Button>
        </div>

        <ListModal />
        <DeletionAlert />
      </>
    )
  }

  if (isSessionsLoading) {
    return (
      <Skeleton className="h-30 w-full" />
    );
  }

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
          <SessionSection />
          <Separator />
          <PasskeySection />
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
