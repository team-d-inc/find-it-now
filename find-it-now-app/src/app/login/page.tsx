import { SignInForm } from '@/app/login/components/signin-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignInForm />
    </div>
  );
}
