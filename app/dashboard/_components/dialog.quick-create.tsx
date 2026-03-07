import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QuickCreateFormDialog } from "./form.quick-create"
import { useState } from "react"

export function QuickCreateDialog({children} : React.PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      <QuickCreateFormDialog onSuccess={() => setOpen(false)} />
    </Dialog>
  )
}
