'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createStaffUser } from '@/app/user/dashboard/staff-members/actions/staff';
import { Profile, ProfileStatus, Role } from '@/generated/prisma';

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: 'Name must be at least 3 characters.',
    })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name must only contain letters and spaces.',
    })
    .regex(/^\S.*\S$|^\S$/, {
      message: 'Name cannot start or end with a space.',
    })
    .regex(/^(?!.*\s{2,}).*$/, {
      message: 'Please include fullname.',
    }),
  email: z.string().email({
    message: 'Invalid email address.',
  }),
  role: z.enum([Role.ADMIN, Role.STAFF], {
    message: 'Role is required.',
  }),
});

interface UpsertStaffFormProps {
  profile?: Profile;
  editMode?: boolean;
  onSubmitSuccess?: (profile: Profile) => void;
  onSubmitError?: (error: string) => void;
  onClose?: () => void;
  organizationId: string;
}

export const UpsertStaffForm = ({ profile, organizationId, ...props }: UpsertStaffFormProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:
        profile?.firstName && profile?.lastName
          ? profile?.firstName + ' ' + profile?.lastName || ''
          : profile?.firstName || '',
      email: profile?.email || '',
      role: (profile?.role as Exclude<Role, 'SERVICE_ADMIN'>) || Role.STAFF,
    },
  });

  const sendInviteEmail = async (email: string) => {
    try {
      const response = await fetch('/api/protected/staff/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send invitation email.');
      }
      return { success: true };
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return { success: false, error: error };
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) {
      setError('Unauthorized to create staff member.');
      return;
    }

    const names = values.name.split(' ');
    const firstName = names[0];
    const lastName = names.slice(1).join(' ') || '';
    const updatedProfile: Profile = {
      id: profile?.id || '0',
      firstName,
      lastName,
      email: values.email,
      organizationId,
      role: values.role as Exclude<Role, 'SERVICE_ADMIN'>,
      status: ProfileStatus.INACTIVE,
      supaUserId: profile?.supaUserId || null,
      createdAt: profile?.createdAt || new Date(),
      updatedAt: profile?.updatedAt || new Date(),
    };

    console.log('Submitting form with values:', updatedProfile);

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const results = await createStaffUser(updatedProfile);
      if (results.error) {
        setError(results.error);
        setSuccess(false);
        setLoading(false);
        return;
      }

      if (!results.success && !results.profile) {
        props.onSubmitError?.('Failed to create staff member.');
        console.error('Failed to create staff member.');
        setError('Failed to create staff member. Please try again.');
        setSuccess(false);
        setLoading(false);
        return;
      }
      // Created successfully
      if (results.profile) {
        props.onSubmitSuccess?.(results.profile);
        // send invite email if the profile is not active
        if (results.profile.status !== ProfileStatus.ACTIVE) {
          const inviteResult = await sendInviteEmail(results.profile.email);
          if (!inviteResult.success) {
            setError((inviteResult.error as string) || 'Failed to send invitation email.');
            setSuccess(false);
            setLoading(false);
            return;
          }
        }
        form.reset();
        setSuccess(true);
        setError(null);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setError((error as string) || 'An unexpected error occurred. Please try again.');
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value} name="role">
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                    <SelectItem value={Role.STAFF}>Staff</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>{error && <div className="mt-2 text-sm text-red-500">{error}</div>}</div>
        <div className="flex justify-end space-x-2">
          <Button
            variant={'outline'}
            type="button"
            onClick={() => props.onClose?.()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading || success ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                {props.editMode ? 'Updating' : 'Adding'} Member
              </>
            ) : (
              <>{props.editMode ? 'Update' : 'Add'} Member</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
