"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"

type ModalProps = React.ComponentProps<typeof Dialog>

function ModalLocal({ ...props }: ModalProps) {
  return <Dialog {...props} />
}

const Trigger = DialogTrigger
const Content = DialogContent
const Header = DialogHeader
const Footer = DialogFooter
const Title = DialogTitle
const Description = DialogDescription
const Close = DialogClose

export const Modal = Object.assign(ModalLocal, {
  Trigger,
  Content,
  Header,
  Footer,
  Title,
  Description,
  Close,
})
