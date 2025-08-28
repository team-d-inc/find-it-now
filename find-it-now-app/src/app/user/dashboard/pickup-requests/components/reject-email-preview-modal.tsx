'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { PickupRequestWithRelations } from '@/types/pickupRequest'

interface RejectEmailPreviewModalProps {
  pickupRequest: PickupRequestWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (data: {
    emailContent: { subject: string; body: string }
    rejectionReason: string
  }) => void
  isProcessing: boolean
}

export function RejectEmailPreviewModal({
  pickupRequest,
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: RejectEmailPreviewModalProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  // Generate email content when modal opens
  useEffect(() => {
    if (open && pickupRequest) {
      setRejectionReason('') // Reset rejection reason
      const generatedSubject = generateEmailSubject()
      setSubject(generatedSubject)
      // Body will be generated after rejection reason is entered
    }
  }, [open, pickupRequest])

  // Update email body when rejection reason changes
  useEffect(() => {
    if (open && pickupRequest && rejectionReason) {
      const generatedBody = generateEmailBody(pickupRequest, rejectionReason)
      setBody(generatedBody)
    }
  }, [open, pickupRequest, rejectionReason])

  const handleConfirm = () => {
    if (!rejectionReason.trim()) {
      return
    }
    onConfirm({
      emailContent: { subject, body },
      rejectionReason
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rejection Email Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason">Rejection Reason (Required)</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please provide a clear reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              className="mt-2 bg-white border-gray-300 focus:border-gray-400 focus-visible:ring-0"
            />
            <p className="text-sm text-gray-500 mt-1">
              This reason will be saved and included in the email to the seeker.
            </p>
          </div>

          <div>
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2 bg-white border-gray-300 focus:border-gray-400 focus-visible:ring-0"
            />
          </div>

          <div>
            <Label htmlFor="body">Email Body</Label>
            <Textarea
              id="body"
              placeholder="Email content will appear here after entering rejection reason..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={14}
              className="mt-2 bg-white border-gray-300 focus:border-gray-400 focus-visible:ring-0 font-mono text-sm"
              disabled={!rejectionReason.trim()}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 bg-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isProcessing || !subject.trim() || !body.trim() || !rejectionReason.trim()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Rejecting...
                </>
              ) : (
                'Reject & Send Email'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function generateEmailSubject(): string {
  return `Item Pickup Request Update`
}

function generateEmailBody(
  pickupRequest: PickupRequestWithRelations, 
  rejectionReason: string
): string {
  const { lostItemReport } = pickupRequest
  const { organization, category } = lostItemReport

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return `Dear ${lostItemReport.firstName} ${lostItemReport.lastName},

  Thank you for using the FindItNow service.

  We regret to inform you that your pickup request for the lost item has been declined.

  ■ Request Details
  • Item Name: ${lostItemReport.title}
  • Category: ${category.name}
  • Date Lost: ${formatDate(lostItemReport.dateLost)}
  • Location Lost: ${lostItemReport.specificLocation}
  • Request Date: ${formatDate(pickupRequest.requestDate)}

  ■ Reason for Rejection
  ${rejectionReason}

  ■ Next Steps
  We understand this may be disappointing. Here are your options:

  1. Review the rejection reason and verify your item details
  2. Contact the organization directly if you believe there has been an error
  3. Submit a new request with additional information if applicable

  ■ Organization Contact Information
  ${organization.name}
  Phone: ${organization.phone}
  Email: ${organization.email}

  ■ Operating Hours
  ${organization.operatingHours || 'Please contact us directly for operating hours.'}

  If you have any questions or need clarification, please don't hesitate to contact the organization directly using the information above.

  We apologize for any inconvenience and appreciate your understanding.

  Best regards,
  FindItNow Team`
}