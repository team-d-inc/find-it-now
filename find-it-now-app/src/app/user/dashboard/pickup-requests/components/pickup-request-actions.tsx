'use client'

import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PickupRequestWithRelations } from '@/types/pickupRequest'
import { ApproveEmailPreviewModal } from './approve-email-preview-modal'
import { RejectEmailPreviewModal } from './reject-email-preview-modal'
import { approvePickupRequest, rejectPickupRequest } from '../actions'

interface PickupRequestActionsProps {
  pickupRequest: PickupRequestWithRelations
  onSuccess: () => void
  disabled?: boolean
}

export function PickupRequestActions({
  pickupRequest,
  onSuccess,
  disabled = false,
}: PickupRequestActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectEmailPreview, setShowRejectEmailPreview] = useState(false)
  const [showEmailPreview, setShowEmailPreview] = useState(false)

  const handleApproveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEmailPreview(true)
  }

  const handleApprove = async (emailContent: { subject: string; body: string }) => {
    setIsProcessing(true)

    try {
      const result = await approvePickupRequest(pickupRequest.id, emailContent)

      if (result.success) {
        toast.success('Pickup request approved successfully')
        setShowEmailPreview(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to approve pickup request')
      }
    } catch {
      toast.error('An error occurred while approving the request')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRejectClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowRejectEmailPreview(true)
  }

  const handleReject = async (data: {
    emailContent: { subject: string; body: string }
    rejectionReason: string
  }) => {
    setIsProcessing(true)

    try {
      const result = await rejectPickupRequest(
        pickupRequest.id,
        data.rejectionReason,
        data.emailContent
      )

      if (result.success) {
        toast.success('Pickup request rejected successfully')
        setShowRejectEmailPreview(false)
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to reject pickup request')
      }
    } catch {
      toast.error('An error occurred while rejecting the request')
    } finally {
      setIsProcessing(false)
    }
  }

  const isDisabled = disabled || isProcessing
  const isStatusFinalized = pickupRequest.status === 'APPROVED' || pickupRequest.status === 'REJECTED'

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled || isStatusFinalized}
            className="h-8 w-8 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {pickupRequest.status === 'PENDING' && (
            <>
              <DropdownMenuItem
                onClick={handleApproveClick}
                disabled={isDisabled}
              >
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRejectClick}
                disabled={isDisabled}
              >
                Reject
              </DropdownMenuItem>
            </>
          )}

          {pickupRequest.status === 'APPROVED' && (
            <DropdownMenuItem disabled className="text-gray-400">
              Approved - Awaiting Pickup
            </DropdownMenuItem>
          )}

          {pickupRequest.status === 'REJECTED' && (
            <DropdownMenuItem disabled className="text-gray-400">
              Rejected
            </DropdownMenuItem>
          )}

        </DropdownMenuContent>
      </DropdownMenu>

      {/* Email Preview Modal for Approval */}
      <div onClick={(e) => e.stopPropagation()}>
        <ApproveEmailPreviewModal
          pickupRequest={pickupRequest}
          open={showEmailPreview}
          onOpenChange={setShowEmailPreview}
          onConfirm={handleApprove}
          isProcessing={isProcessing}
        />
      </div>

      {/* Email Preview Modal for Rejection */}
      <div onClick={(e) => e.stopPropagation()}>
        <RejectEmailPreviewModal
          pickupRequest={pickupRequest}
          open={showRejectEmailPreview}
          onOpenChange={setShowRejectEmailPreview}
          onConfirm={handleReject}
          isProcessing={isProcessing}
        />
      </div>
    </>
  )
}