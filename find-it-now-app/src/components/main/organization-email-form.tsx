'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormFieldBase } from '@/components/common/form-common/form-field-base';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, PartyPopper, Send } from 'lucide-react';
import { sendOrganizationRegistrationLink } from '@/app/(home)/actions';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type EmailFormInputs = z.infer<typeof emailSchema>;

export const OrganizationEmailForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<EmailFormInputs>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: EmailFormInputs) => {
    setIsPending(true);
    const result = await sendOrganizationRegistrationLink(data.email);

    if (result.success) {
      form.reset();
      setIsSubmitted(true);
      toast.success('Registration link sent successfully', {
        description: 'Please check your email for the registration link.',
      });
    } else {
      toast.error(result.error || 'Failed to send registration link');
    }

    setIsPending(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex w-10/12 items-end justify-center gap-4 text-white">
        <div className="w-2/3">
          <h3 className="mb-4 flex items-center gap-2 text-4xl font-semibold">
            Email Sent!
            <PartyPopper className="size-10" />
          </h3>
          <p className="mb-2">
            We&apos;ve sent a registration link to your email. Check your inbox to continue.
          </p>
          <p className="text-md">Didn’t see it? Check your spam folder.</p>
        </div>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          size={'lg'}
          className="mb-4 rounded-4xl bg-transparent"
        >
          Send Another Link
          <Send className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="flex w-full flex-row items-center justify-center gap-4 rounded-none border-none bg-transparent shadow-none">
      <CardHeader className="w-1/2 pr-0 text-right">
        <CardTitle className="text-2xl font-semibold text-white">
          Join us in making lost & found effortless
        </CardTitle>
        <p className="text-white">Enter your email to receive a registration link</p>
      </CardHeader>
      <CardContent className="w-1/2 pl-0">
        <div className="relative inline-block rounded-4xl bg-white p-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end">
              <FormFieldBase
                control={form.control}
                name="email"
                label="Organization Email"
                showLabel={false}
                type="email"
                placeholder="Enter your organization's email"
                inputClassName="p-6 text-xl w-[350px] rounded-tr-none rounded-br-none bg-transparent rounded-4xl pr-16"
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary absolute top-1 right-1 rounded-full p-6 hover:bg-[#2E765E]/90"
                size={'lg'}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    {/* Get signup link */}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
