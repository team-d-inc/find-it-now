'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { FormFieldBase } from '@/components/common/form-common/form-field-base';
import { SelectForm } from '@/components/common/form-common/select-form';
import { Size, Condition, Material, Category, Organization } from '@/generated/prisma';
import { toast } from 'sonner';
import { LostItemReportInput, lostItemReportSchema } from '@/schemas/lostItemSchemas';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { createLostItemReport } from '../action';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

export const LostItemReportForm = ({
  categories,
  organizations,
}: {
  categories: Category[];
  organizations: Organization[];
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<LostItemReportInput>({
    resolver: zodResolver(lostItemReportSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      location: '',
      locationLost: '',
      category: '',
      date: undefined,
      colors: '',
      brand: '',
      size: undefined,
      material: undefined,
      identifiableFeatures: '',
      contents: '',
      condition: undefined,
      description: '',
    },
  });

  const onSubmit = async (data: LostItemReportInput) => {
    setIsPending(true);
    const result = await createLostItemReport(data);
    if (result.success) {
      form.reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsSubmitted(true);
    } else {
      toast.error('Sorry, something went wrong. Please try again.');
    }
    setIsPending(false);
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col rounded border-none p-5 shadow-none md:border md:shadow-lg lg:p-10">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">FindItNow</h1>
          </div>
        </div>
        <Card className="flex w-full flex-col border-none shadow-none">
          <CardContent className="p-0">
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
              <div className="text-center">
                <div className="bg-primary/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Check className="text-primary h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Submitted!</h2>
                <p className="mb-6 text-gray-500">
                  Please check your email for a confirmation message.
                  <br />
                  Make sure to check your spam folder if you don&apos;t see the email in your inbox.
                </p>

                <Button onClick={() => setIsSubmitted(false)} variant="systemGhost" className="gap-2">
                  <span>Submit Another Report</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col rounded border-none p-5 shadow-none md:border md:shadow-lg lg:p-10">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={40} height={40} />
          <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">FindItNow</h1>
        </div>
        <p className="text-xs text-gray-600 sm:text-sm">
          Report your lost item to help us find it.
          <br className="hidden sm:block" />
          By completing all fields in the form below, we can conduct a more effective search.
          <br className="hidden sm:block" />
          Your contact information will be used solely for the purpose of identifying and returning
          your lost item.
        </p>
      </div>
      <Card className="flex w-full flex-col border-none shadow-none">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              {/* Your Information */}
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <h2 className="text-primary mb-4 font-semibold sm:mb-6">Your Information</h2>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                  <FormFieldBase
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                  />
                  <FormFieldBase
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                  />
                  <FormFieldBase
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                  />
                  <FormFieldBase
                    control={form.control}
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <Separator className="my-6 sm:my-8 lg:my-10" />
              {/* Lost Item Details */}
              <h2 className="text-primary mb-4 font-semibold sm:mb-6">Lost Item Details</h2>
              <div className="mb-6 grid grid-cols-1 gap-3 sm:gap-4">
                <FormFieldBase
                  control={form.control}
                  name="title"
                  label="What did you lose?"
                  placeholder="e.g., iPhone, wallet, keys"
                />

                <SelectForm
                  control={form.control}
                  name="location"
                  label="Location"
                  objectArray={organizations}
                  placeholder="Select location"
                />
                <FormFieldBase
                  control={form.control}
                  name="locationLost"
                  label="Specific location within the facility"
                  placeholder="washroom, entrance, waiting area"
                />
                <FormFieldBase
                  control={form.control}
                  name="date"
                  label="Date Lost"
                  type="date"
                  itemClassName="flex-1"
                />
                <SelectForm
                  control={form.control}
                  name="category"
                  label="Category"
                  objectArray={categories}
                  placeholder="Select category"
                />
                <FormFieldBase
                  control={form.control}
                  name="colors"
                  label="Colors"
                  placeholder="e.g., red, blue, black"
                  description="Please enter multiple colors separated by commas"
                />
                <FormFieldBase
                  control={form.control}
                  name="brand"
                  label="Brand"
                  placeholder="e.g., Nike, Apple, Samsung"
                />
                <SelectForm
                  control={form.control}
                  name="material"
                  label="Material"
                  enumOptions={Material}
                  placeholder="Select material"
                />
                <SelectForm
                  control={form.control}
                  name="size"
                  label="Size"
                  enumOptions={Size}
                  placeholder="Select size"
                />
                <SelectForm
                  control={form.control}
                  name="condition"
                  label="Condition"
                  enumOptions={Condition}
                  placeholder="Select condition"
                />
                <FormFieldBase
                  control={form.control}
                  name="contents"
                  label="Contents"
                  placeholder="e.g., keys, wallet, phone"
                  description="Please enter multiple contents separated by commas"
                  asTextarea
                  rows={3}
                />
                <FormFieldBase
                  control={form.control}
                  name="identifiableFeatures"
                  label="Identifiable Features"
                  placeholder="e.g., scratches, stickers, engravings"
                  description="Please enter multiple features separated by commas"
                  asTextarea
                  rows={3}
                />
                <FormFieldBase
                  control={form.control}
                  name="description"
                  label="Description"
                  placeholder="Describe the item in detail"
                  description="Please enter a description of the item"
                  asTextarea
                  rows={3}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex justify-center sm:justify-end">
        <Button
          type="submit"
          disabled={isPending}
          onClick={form.handleSubmit(onSubmit)}
          className="w-full min-w-32 text-base sm:w-auto sm:text-lg"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" />
              Submit
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </div>
    </div>
  );
};
