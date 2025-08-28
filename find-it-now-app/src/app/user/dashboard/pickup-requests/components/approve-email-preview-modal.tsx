'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { PickupRequestWithRelations } from '@/types/pickupRequest'

interface ApproveEmailPreviewModalProps {
  pickupRequest: PickupRequestWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (emailContent: { subject: string; body: string }) => void
  isProcessing: boolean
}

export function ApproveEmailPreviewModal({
  pickupRequest,
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: ApproveEmailPreviewModalProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  // Generate email content when modal opens
  useEffect(() => {
    if (open && pickupRequest) {
      const generatedSubject = generateEmailSubject()
      const generatedBody = generateEmailBody(pickupRequest)
      setSubject(generatedSubject)
      setBody(generatedBody)
    }
  }, [open, pickupRequest])

  const handleConfirm = () => {
    onConfirm({ subject, body })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Approval Email Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
              placeholder="Email content..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="mt-2 bg-white border-gray-300 focus:border-gray-400 focus-visible:ring-0 font-mono text-sm"
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
              disabled={isProcessing || !subject.trim() || !body.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Approving...
                </>
              ) : (
                'Approve & Send Email'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function generateEmailSubject(): string {
  return `Item Pickup Request Approved`
}

function generateEmailBody(pickupRequest: PickupRequestWithRelations): string {
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

  Your pickup request for the lost item has been approved.

  ■ Request Details
  • Item Name: ${lostItemReport.title}
  • Category: ${category.name}
  • Date Lost: ${formatDate(lostItemReport.dateLost)}
  • Location Lost: ${lostItemReport.specificLocation}
  • Request Date: ${formatDate(pickupRequest.requestDate)}

  ■ Pickup Location
  ${organization.name}
  Address: ${organization.address}, ${organization.city}, ${organization.state} ${organization.zipCode}
  Phone: ${organization.phone}
  Email: ${organization.email}

  ■ Operating Hours
  ${organization.operatingHours || 'Please contact us directly for operating hours.'}

  ■ Required for Pickup
  ${organization.verificationMethod && organization.verificationMethodDescription
    ? `${organization.verificationMethod}: ${organization.verificationMethodDescription}`
    : 'Please bring a valid photo ID. Contact us for specific requirements.'}

  ■ Important Notes
  • We will verify item details before release
  • Valid photo identification is required for pickup
  • Please visit during operating hours
  • Items must be collected within 30 days of approval
  • If you cannot collect the item personally, please contact us about authorized representative procedures

  If you have any questions, please contact the organization directly using the information above.

  Best regards,
  FindItNow Team`
}