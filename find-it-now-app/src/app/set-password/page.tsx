import StatusScreen from '@/components/ui/status-screen';
import SetPasswordForm from './components/set-password-form';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/profileService';
import { validateSetPasswordAccess } from './actions';
import { PATHS } from '@/constants/paths';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Password',
};

const SetPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  if (!params.token) {
    return <StatusScreen title="Unauthorized" />;
  }

  const user = await getCurrentUser();

  // If no user is authenticated, check for email and token parameters
  if (!user) {
    const email = params.email;
    const token = params.token;

    if (!email || !token) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-red-500">Email and token are required to set password.</div>
        </div>
      );
    }

    const emailStr = Array.isArray(email) ? email[0] : email;
    const tokenStr = Array.isArray(token) ? token[0] : token;

    // Validate access using the action function
    const validation = await validateSetPasswordAccess(emailStr, tokenStr);

    if (!validation.isValid) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-red-500">Access Denied</div>
            <div className="text-gray-600">{validation.message}</div>
            {validation.message?.includes('already set up') && (
              <div className="mt-4">
                <a href="/login" className="text-blue-500 hover:underline">
                  Go to Login
                </a>
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  if (user && user.app_metadata?.provider === 'email' && user.user_metadata?.email_confirmed_at) {
    redirect(PATHS.lostItems());
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <SetPasswordForm />
    </div>
  );
};

export default SetPasswordPage;
