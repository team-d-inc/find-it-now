'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormFieldBase } from '@/components/common/form-common/form-field-base';
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
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-6 text-white sm:flex-row sm:items-end sm:gap-4">
        <div className="w-full text-center sm:w-2/3 sm:text-left">
          <h3 className="mb-4 flex flex-row items-center justify-center gap-2 text-xl font-semibold sm:text-2xl md:text-4xl sm:justify-start">
            Email Sent!
            <PartyPopper className="size-6 sm:size-8 md:size-10" />
          </h3>
          <p className="mb-2 text-sm sm:text-base">
            We&apos;ve sent a registration link to your email. Check your inbox to continue.
          </p>
          <p className="text-xs sm:text-sm">Didn&apos;t see it? Check your spam folder.</p>
        </div>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
          size={'lg'}
          className="mb-4 rounded-4xl bg-transparent text-xs sm:text-sm md:text-base"
        >
          Send Another Link
          <Send className="size-3 sm:size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-white md:flex-row sm:gap-8">
      <div className="flex flex-col flex-1 items-center justify-center gap-2 text-center sm:items-start sm:text-left">
        <h2 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
          Join us in making lost & found effortless
        </h2>
        <p className="text-sm text-white sm:text-base">
          Enter an organization email to receive a registration link
        </p>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormFieldBase
              control={form.control}
              name="email"
              label="Organization Email"
              showLabel={false}
              type="email"
              placeholder="Organization email"
              inputClassName="text-sm rounded-full p-6 w-60 sm:w-70 text-black"
            />
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary rounded-full hover:bg-[#2E765E]/90 p-6"
              size={'icon'}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                <>
                  <Send className="size-3 sm:size-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
