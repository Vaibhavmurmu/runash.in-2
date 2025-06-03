"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus, Mail, Clock, CheckCircle, XCircle, MoreVertical, Copy, Trash2, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import type { HostInvitation, HostRole } from "@/types/multi-host"
import { MultiHostService } from "@/services/multi-host-service"

export function HostInvitationManager() {
  const [invitations, setInvitations] = useState<HostInvitation[]>([])
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "co-host" as HostRole,
    message: "",
  })

  const multiHostService = MultiHostService.getInstance()

  useEffect(() => {
    // Load existing invitations
    loadInvitations()

    // Subscribe to invitation changes
    const unsubscribe = multiHostService.onInvitationsChange((updatedInvitations) => {
      setInvitations(updatedInvitations)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const loadInvitations = () => {
    // In a real app, this would fetch from an API
    const mockInvitations: HostInvitation[] = [
      {
        id: "inv-1",
        hostId: "current-user-id",
        inviteeEmail: "john@example.com",
        inviteeName: "John Doe",
        role: "co-host",
        permissions: {
          canControlStream: false,
          canShareScreen: true,
          canManageChat: true,
          canInviteOthers: false,
          canUseAnnotations: true,
          canTriggerAlerts: true,
          canControlLayout: false,
          canMuteOthers: false,
        },
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
        message: "Would you like to co-host my upcoming stream?",
      },
      {
        id: "inv-2",
        hostId: "current-user-id",
        inviteeEmail: "sarah@example.com",
        inviteeName: "Sarah Wilson",
        role: "guest",
        permissions: {
          canControlStream: false,
          canShareScreen: true,
          canManageChat: false,
          canInviteOthers: false,
          canUseAnnotations: false,
          canTriggerAlerts: false,
          canControlLayout: false,
          canMuteOthers: false,
        },
        status: "accepted",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours from now
      },
    ]
    setInvitations(mockInvitations)
  }

  const handleSendInvitation = async () => {
    if (!formData.email || !formData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await multiHostService.inviteHost(formData.email, formData.name, formData.role)
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${formData.name}.`,
      })
      setFormData({ email: "", name: "", role: "co-host", message: "" })
      setIsInviteDialogOpen(false)
      loadInvitations() // Refresh the list
    } catch (error) {
      toast({
        title: "Failed to Send Invitation",
        description: "There was an error sending the invitation.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyInviteLink = (invitationId: string) => {
    const inviteLink = `${window.location.origin}/invite/${invitationId}`
    navigator.clipboard.writeText(inviteLink)
    toast({
      title: "Link Copied",
      description: "The invitation link has been copied to your clipboard.",
    })
  }

  const handleResendInvitation = (invitationId: string) => {
    toast({
      title: "Invitation Resent",
      description: "The invitation has been resent.",
    })
  }

  const handleCancelInvitation = (invitationId: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== invitationId))
    toast({
      title: "Invitation Cancelled",
      description: "The invitation has been cancelled.",
    })
  }

  const getStatusBadge = (status: HostInvitation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="text-green-700 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-950/20"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        )
      case "declined":
        return (
          <Badge
            variant="outline"
            className="text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/20"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Declined
          </Badge>
        )
      case "expired":
        return (
          <Badge
            variant="outline"
            className="text-gray-700 border-gray-200 bg-gray-50 dark:text-gray-400 dark:border-gray-800 dark:bg-gray-950/20"
          >
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return null
    }
  }

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (diff <= 0) return "Expired"
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Host Invitations</h2>
          <p className="text-muted-foreground">Manage invitations for co-hosts and guests</p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500">
              <UserPlus className="h-4 w-4 mr-2" />
              Send Invitation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Invite a Host</DialogTitle>
              <DialogDescription>
                Send an invitation to someone to join your stream as a co-host or guest.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as HostRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="co-host">Co-Host (Full permissions)</SelectItem>
                    <SelectItem value="guest">Guest (Limited permissions)</SelectItem>
                    <SelectItem value="moderator">Moderator (Chat only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Would you like to join my stream?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendInvitation} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Invitations Sent</h3>
              <p className="text-muted-foreground mb-4">Start by sending an invitation to a co-host or guest.</p>
              <Button
                onClick={() => setIsInviteDialogOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Send First Invitation
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invitee</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invitation.inviteeName}</p>
                        <p className="text-sm text-muted-foreground">{invitation.inviteeEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {invitation.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm">{getTimeRemaining(invitation.expiresAt)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{invitation.createdAt.toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleCopyInviteLink(invitation.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          {invitation.status === "pending" && (
                            <DropdownMenuItem onClick={() => handleResendInvitation(invitation.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Resend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleCancelInvitation(invitation.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
