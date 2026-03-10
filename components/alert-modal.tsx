"use client"

import * as React from "react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type AlertModalProps = React.ComponentProps<typeof AlertDialog>

function AlertModalLocal({ ...props }: AlertModalProps) {
  return <AlertDialog {...props} />
}

const Trigger = AlertDialogTrigger
const Content = AlertDialogContent
const Header = AlertDialogHeader
const Footer = AlertDialogFooter
const Title = AlertDialogTitle
const Description = AlertDialogDescription
const Cancel = AlertDialogCancel
const Action = AlertDialogAction

export const AlertModal = Object.assign(AlertModalLocal, {
  Trigger,
  Content,
  Header,
  Footer,
  Title,
  Description,
  Cancel,
  Action,
})
