"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChangePasswordStore } from "@/stores/changePasswordStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrengthMeter } from "@/app/set-password/components/password-strength-meter";
import { PasswordRequirements } from "@/app/set-password/components/password-requirements";
import {
  changePasswordFormInput,
  changePasswordSchema,
} from "@/schemas/authSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordAction } from "./action";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/login/actions";

export function ChangePasswordDialog() {
  const { open, closeDialog } = useChangePasswordStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<changePasswordFormInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: changePasswordFormInput) => {
    setIsLoading(true);

    const result = await changePasswordAction(
      data.currentPassword,
      data.newPassword
    );


    if (!result.success) {
      form.setError("currentPassword", {
        type: "manual",
        message: result.message,
      });
      setIsLoading(false);
      return;
    }

    toast.success(result.message, { description: 'Redirect to login page.'});
    setTimeout(() => {
      setIsLoading(false);
      closeDialog();
      logout();
    }, 2000)
  };

  return (
    <Dialog open={open} onOpenChange={(o) => {if(!o) { form.reset(); closeDialog()}}}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and new password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        {...field}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded-md pointer"
                        onClick={() => setShowCurrentPassword((prev) => !prev)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          setShowCurrentPassword((prev) => !prev)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        className="absolute w-8 h-8 right-1 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center hover:bg-gray-100 rounded-md pointer"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          setShowNewPassword((prev) => !prev)
                        }
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="space-y-3">
                    <PasswordStrengthMeter password={field.value} />
                    <PasswordRequirements password={field.value} />
                  </div>
                </FormItem>
              )}
            />
            <p className="text-sm text-neutral-600">
              Use 8 or more letters, numbers, symbols, and capital letters.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <DialogClose asChild>
                <Button type="button" variant="systemGhost" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Changing" : "Change"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
