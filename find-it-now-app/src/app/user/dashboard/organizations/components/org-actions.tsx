'use client'

import { Loader2, MoreHorizontal } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { approveInstitution, rejectInstitution, revertDecision } from '@/app/user/dashboard/organizations/actions'

interface OrganizationActionsProps {
  organizationId: string
  currentStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVERTED'
  onSuccess: () => void
  onOptimisticUpdate?: (action: { type: 'approve' | 'reject' | 'revert'; organizationId: string; reason?: string }) => void
  disabled?: boolean
}

export function OrganizationActions({
  organizationId,
  currentStatus,
  onSuccess,
  onOptimisticUpdate,
  disabled = false,
}: OrganizationActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsProcessing(true)
    
    // Optimistic update
    if (onOptimisticUpdate) {
      onOptimisticUpdate({ type: 'approve', organizationId })
    }
    
    try {
      const result = await approveInstitution(organizationId)
      if (result.success) {
        toast.success('Organization approved successfully')
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to approve organization')
        // Revert optimistic update on error - refresh to get actual state
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast.error(errorMessage)
      // Revert optimistic update on error - refresh to get actual state
      onSuccess()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason')
      return
    }

    setIsProcessing(true)
    
    // Optimistic update
    if (onOptimisticUpdate) {
      onOptimisticUpdate({ type: 'reject', organizationId, reason: rejectionReason })
    }
    
    try {
      const result = await rejectInstitution(organizationId, rejectionReason)
      if (result.success) {
        toast.success('Organization rejected successfully')
        setShowRejectDialog(false)
        setRejectionReason('')
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to reject organization')
        // Revert optimistic update on error - refresh to get actual state
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast.error(errorMessage)
      // Revert optimistic update on error - refresh to get actual state
      onSuccess()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRevert = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsProcessing(true)
    
    // Optimistic update
    if (onOptimisticUpdate) {
      onOptimisticUpdate({ type: 'revert', organizationId })
    }
    
    try {
      const result = await revertDecision(organizationId)
      if (result.success) {
        toast.success('Decision reverted successfully')
        onSuccess()
      } else {
        toast.error(result.error || 'Failed to revert decision')
        // Revert optimistic update on error - refresh to get actual state
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast.error(errorMessage)
      // Revert optimistic update on error - refresh to get actual state
      onSuccess()
    } finally {
      setIsProcessing(false)
    }
  }

  const isDisabled = disabled || isProcessing


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDisabled}
            className="h-8 w-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus === 'PENDING' && (
            <>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleApprove(e)
                }}
                disabled={isDisabled}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRejectDialog(true)
                }}
                disabled={isDisabled}
              >
                Reject
              </DropdownMenuItem>
            </>
          )}

          {currentStatus === 'REJECTED' && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                handleRevert(e)
              }}
              disabled={isDisabled}
              className="text-blue-600 focus:text-blue-600"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Revert
            </DropdownMenuItem>
          )}

          {currentStatus === 'REVERTED' && (
            <>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleApprove(e)
                }}
                disabled={isDisabled}
                className="text-green-600 focus:text-green-600"
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setShowRejectDialog(true)
                }}
                disabled={isDisabled}
                className="text-red-600 focus:text-red-600"
              >
                Reject
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rejection Reason Dialog */}
      <div onClick={(e) => e.stopPropagation()}>
        <Dialog 
          open={showRejectDialog} 
          onOpenChange={(open) => {
            if (!open) {
              setRejectionReason('')
            }
            setShowRejectDialog(open)
          }}>
          <DialogContent 
            className="bg-white sm:max-w-[425px]"
          >
          <DialogHeader>
            <DialogTitle>Enter Rejection Reason</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                placeholder="Please enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="mt-3 bg-white border-gray-300 focus:border-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:ring-offset-0 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason('')
                }}
                disabled={isProcessing}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 bg-white"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject()}
                disabled={isProcessing || !rejectionReason.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Rejecting...
                  </>
                ) : (
                  'Confirm Rejection'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </>
  )
}