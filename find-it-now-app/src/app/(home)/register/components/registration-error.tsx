import Image from 'next/image';
import Link from 'next/link';

interface RegistrationErrorProps {
  title: string;
  message: string;
}

export function RegistrationError({ title, message }: RegistrationErrorProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="bg-primary flex w-1/3 items-center justify-center">
        <Image src="/logo-green.svg" alt="Logo" width={80} height={80} className="h-20 w-20" />
      </div>
      <div className="flex h-screen w-2/3 items-center justify-center">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="mb-6 whitespace-pre-line text-gray-600">{message}</p>
          <Link
            href="/service"
            className="bg-primary hover:bg-primary/90 inline-block rounded-lg px-6 py-3 text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
