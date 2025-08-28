import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { DialogHeader } from '../../../../../components/ui/dialog';
import { UpsertStaffForm } from './upsert-staff-form';
import { Profile } from '@/generated/prisma';

type Props = {
  editingStaff?: Profile | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmitSuccess: () => void;
  onClose: () => void;
  organizationId: string | null;
};

export const UpsertStaffModal = ({
  onSubmitSuccess,
  onClose,
  editingStaff,
  open,
  setOpen,
  organizationId,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
        </DialogHeader>
        <UpsertStaffForm
          profile={editingStaff || undefined}
          editMode={!!editingStaff}
          onSubmitSuccess={onSubmitSuccess}
          onClose={() => {
            setOpen(false);
            onClose();
          }}
          organizationId={organizationId || ''}
        />
      </DialogContent>
    </Dialog>
  );
};
