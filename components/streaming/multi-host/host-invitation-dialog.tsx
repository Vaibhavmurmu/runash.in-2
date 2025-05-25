"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { HostRole } from "@/types/multi-host"
import { MultiHostService } from "@/services/multi-host-service"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.enum(["co-host", "guest", "moderator"] as const),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface HostInvitationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HostInvitationDialog({ open, onOpenChange }: HostInvitationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const multiHostService = MultiHostService.getInstance()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "co-host",
      message: "",
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await multiHostService.inviteHost(values.email, values.name, values.role as HostRole)
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${values.name} (${values.email}).`,
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite a Co-Host</DialogTitle>
          <DialogDescription>
            Send an invitation to someone to join your stream as a co-host, guest, or moderator.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="co-host">Co-Host (Can speak and share screen)</SelectItem>
                      <SelectItem value="guest">Guest (Limited permissions)</SelectItem>
                      <SelectItem value="moderator">Moderator (Can manage chat only)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {field.value === "co-host"
                      ? "Co-hosts can speak, share their screen, and interact with viewers."
                      : field.value === "guest"
                        ? "Guests can speak and share their screen but have limited permissions."
                        : "Moderators can only manage chat and cannot appear on stream."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Hey, would you like to join my stream?" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
