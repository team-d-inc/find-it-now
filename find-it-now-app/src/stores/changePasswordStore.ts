import { create } from "zustand";

interface ChangePasswordDialogState {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useChangePasswordStore = create<ChangePasswordDialogState>(
  (set) => ({
    open: false,
    openDialog: () => set({ open: true }),
    closeDialog: () => set({ open: false }),
  })
);
