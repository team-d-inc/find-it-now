'use client';

import { useState } from 'react';
import { UserRoundPlus } from 'lucide-react';
import { StaffDataTable } from './staff-data-table';
import { columns } from './staff-table-columns';
import { Profile } from '@/generated/prisma';
import { UpsertStaffModal } from './staff-upsert-modal';
import { Button } from '@/components/ui/button';
import { StaffDeleteModal } from '@/app/user/dashboard/staff-members/components/staff-delete-modal';
import { toast } from 'sonner';
import useSWR from 'swr';

async function fetchStaffMembers() {
  const res = await fetch('/api/protected/staff');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

type Props = {
  initialData: Profile[];
  currentProfile: Profile | null;
};

export const StaffClientPage = ({ initialData, currentProfile }: Props) => {
  const { data, isLoading, mutate } = useSWR<Profile[]>('/api/protected/staff', fetchStaffMembers, {
    fallbackData: initialData,
  });

  const [upsertDialogOpen, setUpsertDialogOpen] = useState(false);
  const [staffDeleteModalOpen, setStaffDeleteModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState<Profile | null>(null);

  const handleRowEdit = (row: Profile) => {
    setActiveRow(row);
    setUpsertDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setActiveRow(null);
    setUpsertDialogOpen(false);
    setStaffDeleteModalOpen(false);
  };

  const openDeleteModal = async (row: Profile) => {
    setStaffDeleteModalOpen(true);
    setActiveRow(row);
  };

  const handleSubmitSuccess = () => {
    setUpsertDialogOpen(false);
    mutate();
  };

  const handleRowDeleteError = (error: Error) => {
    toast.error(error.message);
  };

  const handleRowDeleteSuccess = () => {
    toast.success('Staff member deleted successfully');
    setActiveRow(null);
    setStaffDeleteModalOpen(false);
    mutate();
  };

  return (
    <div className="space-y-4 p-5 pt-0">
      <div className="mb-0 flex justify-end">
        <Button
          size={'lg'}
          className="cursor-pointer"
          onClick={() => {
            setActiveRow(null);
            setUpsertDialogOpen(true);
          }}
        >
          <UserRoundPlus />
          Add Staff Member
        </Button>
      </div>
      <UpsertStaffModal
        onSubmitSuccess={handleSubmitSuccess}
        onClose={handleCloseDialog}
        editingStaff={!!activeRow ? activeRow : null}
        open={upsertDialogOpen}
        setOpen={setUpsertDialogOpen}
        organizationId={currentProfile?.organizationId ?? null}
      />
      {activeRow ? (
        <StaffDeleteModal
          staffProfile={activeRow}
          open={staffDeleteModalOpen}
          setOpen={setStaffDeleteModalOpen}
          onDeleteSuccess={handleRowDeleteSuccess}
          onDeleteError={handleRowDeleteError}
          onClose={handleCloseDialog}
          organizationId={currentProfile?.organizationId ?? null}
        />
      ) : null}
      <StaffDataTable
        columns={columns}
        data={data || []}
        loading={isLoading}
        onRowEdit={handleRowEdit}
        onRowDelete={openDeleteModal}
        onRefresh={() => mutate()}
      />
    </div>
  );
};
