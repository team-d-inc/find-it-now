'use client';

import { Organization } from '@/generated/prisma';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { OrganizationFormInputs, organizationSchema } from '@/schemas/orgSchemas';
import { FormFieldBase } from '@/components/common/form-common/form-field-base';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LogoUpload } from '@/app/user/settings/organization/components/logo-upload';
import { useFirebaseStorage } from '@/hooks/useFirebaseStorage';
import { toast } from 'sonner';
import { updateOrganization } from '../action';
import { LoaderCircle } from 'lucide-react';
import { PATHS } from '@/constants/paths';
import { useBack } from '@/hooks/useBack';

type Props = {
  initialData: Organization;
  organizationId: string;
  isEdit?: boolean;
};

export const OrganizationForm = ({ initialData, organizationId, isEdit = false }: Props) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const { uploadSingleImage, imageLoading, deleteImage } = useFirebaseStorage();
  const goBack = useBack(PATHS.lostItems());    

  const form = useForm<OrganizationFormInputs>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zipCode || '',
      country: initialData?.country || '',
      operatingHours: initialData?.operatingHours || '',
      defaultRetentionPeriod: initialData?.defaultRetentionPeriod || 0,
      verificationMethod: initialData?.verificationMethod || '',
      verificationMethodDescription: initialData?.verificationMethodDescription || '',
      logoUrl: initialData?.logoUrl || '',
    },
  });

  useEffect(() => {
    if (!initialData) return;
    form.reset({
      name: initialData.name || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      zipCode: initialData.zipCode || '',
      country: initialData.country || '',
      operatingHours: initialData.operatingHours || '',
      defaultRetentionPeriod: initialData.defaultRetentionPeriod || 0,
      verificationMethod: initialData.verificationMethod || '',
      verificationMethodDescription: initialData.verificationMethodDescription || '',
      logoUrl: initialData.logoUrl || '',
    });
    setExistingLogoUrl(initialData.logoUrl || '');
  }, [initialData, form]);

  const onSubmit = async (data: OrganizationFormInputs) => {
    setIsPending(true);
    try {
      if (uploadedImage) {
        const logoUrl = await uploadSingleImage(uploadedImage, 'org-logo');

        if (logoUrl) {
          data.logoUrl = logoUrl;
        } else {
          toast.error('Fail to upload logo image.');
          setIsPending(false);
          return;
        }
      } else if (uploadedImage === null) {
        if (existingLogoUrl) {
          try {
            await deleteImage(existingLogoUrl);
          } catch (error) {
            console.error(error);
            toast.error('Failed to delete existing logo:');
          }
        }
        data.logoUrl = '';
      }

      const result = await updateOrganization(organizationId, data);

      if (!result.success) {
        toast.error(result.message || 'Unknown error occurred', {
          description: `Status: ${result.status}`,
        });
      } else {
        toast.success('Organization updated successfully.');
        setUploadedImage(null);
        if (result.data) {
          form.reset({
            name: result.data.name || '',
            email: result.data.email || '',
            phone: result.data.phone || '',
            address: result.data.address || '',
            city: result.data.city || '',
            state: result.data.state || '',
            zipCode: result.data.zipCode || '',
            country: result.data.country || '',
            operatingHours: result.data.operatingHours || '',
            defaultRetentionPeriod: result.data.defaultRetentionPeriod || 0,
            verificationMethod: result.data.verificationMethod || '',
            verificationMethodDescription: result.data.verificationMethodDescription || '',
            logoUrl: result.data.logoUrl || '',
          });
          setExistingLogoUrl(result.data.logoUrl || '');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Something wrong when update organization.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-7 pt-3">
      <Card className="w-full p-10">
        <CardContent className="flex w-full flex-col p-0">
          <Form {...form}>
            <fieldset disabled={!isEdit}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="lg:flex lg:align-top">
                  <h3 className="text-primary mb-6 text-base font-semibold md:w-[250px]">
                    Organization Information
                  </h3>
                  <div className="flex grow flex-col gap-4 pt-1">
                    <LogoUpload
                      image={existingLogoUrl}
                      onFileSelect={setUploadedImage}
                      isEdit={isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="name"
                      label="Name"
                      placeholder="Organization Name"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="email"
                      label="Email"
                      placeholder="Organization Email"
                      disabled={true}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="phone"
                      label="Phone Number"
                      placeholder="Organization Phone Number"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="operatingHours"
                      label="Operating Hours"
                      placeholder="Operating Hours"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="address"
                      label="Address"
                      placeholder="Address"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="City"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="State"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="zipCode"
                      label="Zip Code"
                      placeholder="Zip Code"
                      disabled={!isEdit}
                    />
                    <FormFieldBase
                      control={form.control}
                      name="country"
                      label="Country"
                      placeholder="Country"
                      disabled={!isEdit}
                    />
                  </div>
                </div>

                <Separator />

                <div className="lg:flex lg:align-top">
                  <h3 className="text-primary mb-6 text-base font-semibold md:w-[250px]">
                    Lost and Found Policy
                  </h3>
                  <div className="flex grow flex-col gap-4">
                    <FormFieldBase
                      control={form.control}
                      name="defaultRetentionPeriod"
                      label="Default Retention Period"
                      disabled={!isEdit}
                      type="number"
                      placeholder="e.g., 90"
                    />
                    <FormFieldBase
                      control={form.control}
                      name="verificationMethod"
                      label="Verification Method"
                      disabled={!isEdit}
                      placeholder="e.g., government ID, student/staff ID"
                    />
                    <FormFieldBase
                      control={form.control}
                      name="verificationMethodDescription"
                      label="Verification Method Description"
                      disabled={!isEdit}
                      asTextarea
                      placeholder="Provide detailed instructions for staff on how to perform the verification when releasing a lost item. Include required documents, acceptable alternatives, and step-by-step procedures."
                    />
                  </div>
                </div>
              </form>
            </fieldset>
          </Form>
        </CardContent>
      </Card>

      {/* Form buttons */}
      {isEdit && (
        <div className="mt-10 flex justify-end gap-4 px-7">
          <Button variant="systemGhost" onClick={goBack} className="w-32 cursor-pointer">
            Cancel
          </Button>
          <Button type="button" onClick={() => form.handleSubmit(onSubmit)()} className="min-w-32">
            {isPending || imageLoading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Save
              </>
            ) : (
              <>Save</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
