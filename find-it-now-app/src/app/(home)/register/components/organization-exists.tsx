import Image from 'next/image';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface OrganizationExistsProps {
  email: string;
}

export function OrganizationExists({ email }: OrganizationExistsProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="bg-primary flex w-1/3 items-center justify-center">
        <Image src="/logo-green.svg" alt="Logo" width={80} height={80} className="h-20 w-20" />
      </div>
      <div className="flex h-screen w-2/3 items-center justify-center">
        <div className="max-w-lg p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Organization Already Registered</h2>
          <p className="mb-2 text-gray-600">An organization with the email address</p>
          <p className="mb-6 text-lg font-medium text-gray-900">{email}</p>
          <p className="mb-8 text-gray-600">
            has already been registered in our system.
            <br />
            If you need assistance accessing your account or have any questions,
            <br />
            please contact our support team.
          </p>
          <div className="space-y-3">
            <Link
              href="/service"
              className="bg-primary hover:bg-primary/90 inline-block rounded-lg px-6 py-3 text-white transition-colors"
            >
              Back to Home
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Need help?{' '}
              <a href="mailto:support@finditnow.com" className="text-primary hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
