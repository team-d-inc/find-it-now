'use client';

import { Control, FieldPath, useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldBaseProps<T extends Record<string, unknown>> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: string;
  inputClassName?: string;
  itemClassName?: string;
  description?: string;
  asTextarea?: boolean;
  rows?: number;
  showLabel?: boolean;
  disabled?: boolean;
}

export const FormFieldBase = <T extends Record<string, unknown>>({
  name,
  label,
  placeholder,
  type = 'text',
  inputClassName,
  itemClassName,
  description,
  asTextarea = false,
  rows = 3,
  showLabel = true,
  disabled = false,
}: FormFieldBaseProps<T>) => {
  const { register } = useFormContext<T>();
  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className={itemClassName}>
          {showLabel && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {asTextarea ? (
              <Textarea
                {...register(name)}
                className={cn('w-full resize-none border-0 bg-gray-100', inputClassName)}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
              />
            ) : (
              <Input
                {...register(name)}
                className={cn('w-full border-0 bg-gray-100 shadow-none', inputClassName)}
                placeholder={placeholder}
                type={type}
                disabled={disabled}
              />
            )}
          </FormControl>
          {description && (
            <FormDescription className="text-xs text-gray-500">{description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
