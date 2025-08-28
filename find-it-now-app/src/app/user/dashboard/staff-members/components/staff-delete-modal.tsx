import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Profile } from '@/generated/prisma';
import { deleteStaffUser } from '@/app/user/dashboard/staff-members/actions/staff';
import { Loader2 } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { DialogTitle } from '@radix-ui/react-dialog';

interface StaffDeleteModalProps {
  staffProfile: Profile;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDeleteSuccess: (user: User) => void;
  onDeleteError?: (error: Error) => void;
  onClose: () => void;
  organizationId: string | null;
}

export const StaffDeleteModal: React.FC<StaffDeleteModalProps> = ({
  open,
  onClose,
  setOpen,
  staffProfile,
  onDeleteSuccess,
  onDeleteError,
  organizationId,
}) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    if (!organizationId) {
      console.error('Organization ID is required to delete a staff member.');
      return;
    }
    try {
      setLoading(true);
      const deletedProfile = (await deleteStaffUser(staffProfile.id)) as unknown as User;
      onDeleteSuccess(deletedProfile);
      setLoading(false);
    } catch (error) {
      onDeleteError?.(error as Error);
      setLoading(false);
      console.error('Failed to delete staff member:', error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogTitle>Delete Staff Member</DialogTitle>
        <div className="">
          <p>
            Are you sure you want to delete{' '}
            <b>
              {staffProfile.firstName} {staffProfile.lastName}
            </b>{' '}
            staff member?
          </p>
          <p className="mt-4 text-sm text-red-400">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant={'outline'} onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={'destructive'} onClick={onDelete} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDeleteModal;
