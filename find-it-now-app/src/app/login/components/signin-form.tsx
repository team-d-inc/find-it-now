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
import { signInSchema, SignInFormInputs } from '@/schemas/authSchemas';
import { useForm } from 'react-hook-form';
import { login } from '@/app/login/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PATHS } from '@/constants/paths';
import { CircleAlert, LoaderCircle } from 'lucide-react';
import { TogglePassword } from '@/components/common/form-common/toggle-password';
import Image from 'next/image';

export const SignInForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormInputs) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await login(formData);

      if (!result.success || !result.profile) {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
        return;
      }

      if (result.profile.role === 'ADMIN' || result.profile.role === 'STAFF') {
        router.push(PATHS.lostItems());
      } else {
        router.push(PATHS.orgDashboard());
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-lg border-none p-6 shadow-none">
      <CardHeader className="text-center flex flex-col items-center gap-4">
        <Image src="/logo.svg" alt="Logo" width={100} height={100} />
        <CardTitle className="text-2xl font-semibold sm:text-4xl">Welcome back</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Sign in to your account below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" {...field} placeholder="Enter your email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        placeholder="Enter your password"
                      />
                      <TogglePassword
                        show={showPassword}
                        onToggle={() => setShowPassword((prev) => !prev)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
            <div className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
              <CircleAlert className="h-5 w-5" />
              This is a login page for organizations that manage lost and found items.
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
