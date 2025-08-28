'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { OrganizationWithUserFormInputs, organizationWithUserSchema } from '@/schemas/orgSchemas';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldBase } from '@/components/common/form-common/form-field-base';
import { AddressForm } from '@/components/common/address-form/address-form';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { createOrganization } from '@/app/(home)/register/action';
import { Check, CircleQuestionMark, Loader2 } from 'lucide-react';

interface OrganizationRegisterFormProps {
  email?: string;
  token?: string;
}

export const OrganizationRegisterForm = ({ email, token }: OrganizationRegisterFormProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const form = useForm<OrganizationWithUserFormInputs>({
    resolver: zodResolver(organizationWithUserSchema),
    defaultValues: {
      organization: {
        name: '',
        email: email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        operatingHours: '',
        defaultRetentionPeriod: 0,
        verificationMethod: '',
        verificationMethodDescription: '',
      },
      user: {
        firstname: '',
        lastname: '',
        email: '',
      },
    },
  });

  // Set email when prop changes
  useEffect(() => {
    if (email) {
      form.setValue('organization.email', email);
    }
  }, [email, form]);

  const handleSubmitSuccess = () => {
    form.reset();
    setHasSubmitted(true);
  };

  const handleSubmitError = (result: { message?: string; status?: number }) => {
    const errorMessage = result.message || 'Unknown error occurred';
    const statusDescription = result.status ? `Status: ${result.status}` : undefined;

    toast.error(errorMessage, {
      description: statusDescription,
    });
  };

  const onSubmit = async (data: OrganizationWithUserFormInputs) => {
    try {
      setIsPending(true);

      const result = await createOrganization(data, token);

      if (result.success) {
        handleSubmitSuccess();
      } else {
        handleSubmitError(result);
      }
    } catch (error) {
      console.error('Organization registration error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  if (hasSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center space-y-6">
        <div className="p-6 text-center">
          <div className="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Check className="text-primary h-8 w-8" />
          </div>
          <h2 className="text-primary mb-2 text-2xl font-bold">Registration Submitted!</h2>
          <p className="mb-4 text-gray-400">
            Your registration has been submitted.
            <br />
            We will review your form and contact you at the email address you provided.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-10 pt-10 lg:p-25">
      <Card className="border-0 py-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-primary mb-3 text-4xl font-semibold">Register</CardTitle>
          <CardDescription>Please fill in the details.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-primary font-semibold">Organization Information</h3>
              <p className="text-sm text-gray-500">Please fill in the details.</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <FormFieldBase
                    control={form.control}
                    name="organization.name"
                    label="Name"
                    placeholder="Organization Name"
                  />
                  <FormFieldBase
                    control={form.control}
                    name="organization.email"
                    label="Email"
                    placeholder="Organization Email"
                    type="email"
                    disabled={!!email}
                  />
                  <FormFieldBase
                    control={form.control}
                    name="organization.phone"
                    label="Phone Number"
                    placeholder="Organization Phone Number"
                  />
                  <FormFieldBase
                    control={form.control}
                    name="organization.operatingHours"
                    label="Operating Hours"
                    placeholder="Operating Hours"
                  />
                  <div className="col-span-1 md:col-span-2">
                    <AddressForm />
                  </div>
                </div>

                <Separator className="my-15" />

                <div className="space-y-8">
                  <div>
                    <h3 className="text-primary font-semibold">Lost and Found Policy</h3>
                    <p className="text-sm text-gray-500">
                      Please describe your facility’s policy for retaining, disposing of, or
                      returning lost items, including the retention period and any relevant
                      procedures.
                    </p>
                  </div>
                  <FormFieldBase
                    control={form.control}
                    name="organization.defaultRetentionPeriod"
                    label="Lost Item Retention Period (days)"
                    description="Number of days you will retain lost items before disposal or return, according to your policy."
                    placeholder="e.g., 90"
                    type="number"
                  />
                  <FormFieldBase
                    control={form.control}
                    name="organization.verificationMethod"
                    label="Verification Method"
                    placeholder="e.g., government ID, student/staff ID"
                    description="Specify how you will verify the claimant’s identity when handing over a lost item."
                  />
                  <FormFieldBase
                    control={form.control}
                    name="organization.verificationMethodDescription"
                    label="Verification Method Description (optional)"
                    description="Provide detailed instructions for staff on how to perform the verification when releasing a lost item. Include required documents, acceptable alternatives, and step-by-step procedures."
                    asTextarea
                  />
                </div>

                <Separator className="my-15" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-primary font-semibold">User Information</h3>
                    <p className="text-sm text-gray-500">
                      This information will be used to issue an administrator user who can access
                      this system.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <FormFieldBase
                      control={form.control}
                      name="user.firstname"
                      label="First Name"
                      placeholder="First Name"
                    />
                    <FormFieldBase
                      control={form.control}
                      name="user.lastname"
                      label="Last Name"
                      placeholder="Last Name"
                    />
                    <FormFieldBase
                      control={form.control}
                      name="user.email"
                      label="Email"
                      placeholder="Email Address"
                      type="email"
                      description="We will notify this email address once your administrator account has been created."
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending} className="min-w-[150px]">
                    {isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Register</span>
                      </>
                    ) : (
                      <span>Register</span>
                    )}
                  </Button>
                </div>

                <div className="p-4 mt-10">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <CircleQuestionMark className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">
                        Need help?{' '}
                        <a
                          href="mailto:support@finditnow.com"
                          className="font-medium text-primary underline decoration-primary transition-all duration-200 hover:text-primary/80 hover:decoration-primary/80"
                        >
                          Contact us
                        </a>{' '}
                        for assistance
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
