'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { setPasswordSchema, SetPasswordFormInputs } from '@/schemas/authSchemas';
import { useForm } from 'react-hook-form';
import { setPassword } from '@/app/set-password/actions';
import { PasswordStrengthMeter } from './password-strength-meter';
import { PasswordRequirements } from './password-requirements';
import { useState } from 'react';
import { TogglePassword } from '@/components/common/form-common/toggle-password';
import { CircleX, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/constants/paths';
import { toast } from 'sonner';
import Image from 'next/image';

const SetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SetPasswordFormInputs>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SetPasswordFormInputs) => {
    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('_url', window.location.href);

    try {
      setIsLoading(true);
      const response = await setPassword(formData);
      if (response.success) {
        // Redirect to login page on success
        toast.success('Password set successfully!');
        router.push(PATHS.login());
      } else {
        setError(response.message || 'Sorry, something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error setting password:', error);
    } finally {
      form.reset();
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg space-y-2 border-none p-6 shadow-none sm:space-y-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-semibold sm:text-4xl">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          <CardTitle className="text-2xl font-semibold sm:text-4xl">Set Your Password</CardTitle>
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Please create a password to complete your account setup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                <CircleX className="h-4 w-4 text-red-700" />
                <h3 className="text-sm font-semibold text-red-700">Error</h3>
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        placeholder="Enter new password"
                      />
                      <TogglePassword
                        show={showPassword}
                        onToggle={() => setShowPassword((prev) => !prev)}
                      />
                    </div>
                  </FormControl>
                  <p className="text-sm text-neutral-600">
                    Use 8 or more letters, numbers, symbols, and capital letters.
                  </p>
                  <FormMessage />
                  <div className="space-y-3">
                    <PasswordStrengthMeter password={field.value} />
                    <PasswordRequirements password={field.value} />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...field}
                        placeholder="Confirm new password"
                      />
                      <TogglePassword
                        show={showConfirmPassword}
                        onToggle={() => setShowConfirmPassword((prev) => !prev)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full cursor-pointer text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span>Completing setup</span>
                </>
              ) : (
                'Complete setup'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SetPasswordForm;
