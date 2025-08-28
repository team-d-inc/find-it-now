import { OrganizationRegisterForm } from '@/app/(home)/register/components/org-register-form';
import { RegistrationError } from '@/app/(home)/register/components/registration-error';
import { OrganizationExists } from '@/app/(home)/register/components/organization-exists';
import Image from 'next/image';
import { validateRegistrationToken, getTokenErrorDisplay } from '@/lib/auth/registrationToken';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register Organization',
};

interface RegisterPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;
  const validationResult = validateRegistrationToken(token);

  // Handle invalid token cases
  if (!validationResult.isValid) {
    const { title, message } = getTokenErrorDisplay(validationResult.error);
    return <RegistrationError title={title} message={message} />;
  }

  // Check if organization already exists
  const existingOrganization = await prisma.organization.findUnique({
    where: { email: validationResult.email! },
  });

  if (existingOrganization) {
    return <OrganizationExists email={validationResult.email!} />;
  }

  // Token is valid and organization doesn't exist, proceed with registration form
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex w-1/3 items-center justify-center gap-4 bg-gray-50">
        <div className="flex flex-col items-center">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} className="h-20 w-20" />
          <p className="text-4xl font-bold">FindItNow</p>
        </div>
      </div>
      <div className="h-screen w-2/3">
        <OrganizationRegisterForm email={validationResult.email!} token={token} />
      </div>
    </div>
  );
}
