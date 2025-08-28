import { Control, FieldPath } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';

type Group = {
  label: string;
  options: { value: string; label: string }[];
};

interface SelectFormProps<
  T extends Record<string, unknown>,
  E extends Record<string, string | number> | undefined = undefined,
> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  groups?: Group[];
  enumOptions?: E;
  objectArray?: Array<{ id: string; name: string }>;
  placeholder?: string;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
}

export const SelectForm = <
  T extends Record<string, unknown>,
  E extends Record<string, string | number> | undefined = undefined,
>({
  control,
  name,
  label,
  groups,
  enumOptions,
  objectArray,
  placeholder = 'Select an option',
  className,
  showLabel = true,
  disabled = false,
}: SelectFormProps<T, E>) => {
  const enumGroups: Group[] = enumOptions
    ? [
        {
          label,
          options: Object.keys(enumOptions)
            .filter((key) => isNaN(Number(key)))
            .map((key) => {
              const value = enumOptions[key as keyof E] as string;
              return {
                value,
                label: value,
              };
            }),
        },
      ]
    : [];

  const objectGroups: Group[] = objectArray
    ? [
        {
          label,
          options: objectArray.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        },
      ]
    : [];

  const processedGroups: Group[] = groups?.length
    ? groups
    : objectGroups.length
      ? objectGroups
      : enumGroups;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {showLabel && <FormLabel>{label}</FormLabel>}
          <Select
            onValueChange={(val) =>
              field.onChange(val as E extends undefined ? string : E[keyof E])
            }
            value={(field.value as string) ?? ''}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full border-0 bg-gray-100 shadow-none">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {processedGroups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
