import { FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { AutoCompleteAddress } from './auto-complete-address';
import { Input } from '@/components/ui/input';

type Props = {
  disabled?: boolean;
};

export const AddressForm = ({ disabled = false }: Props) => {
  const { setValue, control } = useFormContext();

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Address</FormLabel>
        <AutoCompleteAddress
          disabled={disabled}
          onPlaceExtract={({ address, city, state, country, zipCode }) => {
            setValue('organization.address', address, { shouldValidate: true });
            setValue('organization.city', city, { shouldValidate: true });
            setValue('organization.state', state, { shouldValidate: true });
            setValue('organization.country', country, { shouldValidate: true });
            setValue('organization.zipCode', zipCode, { shouldValidate: true });
          }}
        />
      </FormItem>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="organization.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full border-0 bg-gray-100 shadow-none"
                  placeholder="City"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="organization.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full border-0 bg-gray-100 shadow-none"
                  placeholder="State"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="organization.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full border-0 bg-gray-100 shadow-none"
                  placeholder="Country"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="organization.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZipCode</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="w-full border-0 bg-gray-100 shadow-none"
                  placeholder="Zip Code"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
