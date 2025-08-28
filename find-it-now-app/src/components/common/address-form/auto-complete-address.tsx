import PlaceAutocompleteElement from 'react-google-autocomplete';
import { cn } from '@/lib/utils';

type PlaceInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

type Props = {
  onPlaceExtract: (data: PlaceInfo) => void;
  disabled?: boolean;
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type PlaceResult = {
  address_components?: AddressComponent[];
  // add other properties if needed
};

export const AutoCompleteAddress = ({ onPlaceExtract, disabled = false }: Props) => {
  const handlePlaceSelected = (place: PlaceResult) => {
    const components = place.address_components ?? [];

    const get = (type: string) =>
      components.find((c: AddressComponent) => c.types.includes(type))?.short_name ?? '';

    onPlaceExtract({
      address: [get('street_number'), get('route')].filter(Boolean).join(' '),
      city: get('locality'),
      state: get('administrative_area_level_1'),
      country: get('country'),
      zipCode: get('postal_code'),
    });
  };

  return (
    <PlaceAutocompleteElement
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
      onPlaceSelected={handlePlaceSelected}
      options={{
        types: ['geocode'],
        componentRestrictions: { country: 'ca' },
      }}
      placeholder="Search location"
      className={cn(
        'ring-offset-background flex h-10 w-full rounded bg-gray-100 px-3 py-2 text-sm shadow-none',
      )}
      disabled={disabled}
    />
  );
};
