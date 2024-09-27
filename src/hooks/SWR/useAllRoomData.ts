'use client';

import { RoomSchema } from '@/lib/schemas';
import useSWR from 'swr';
import { z, ZodError } from 'zod';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useAllRoomData = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/room', fetcher, {
    revalidateOnFocus: true,
    refleshInterval: 1000,
  });
  const RoomsSchema = z.array(RoomSchema);

  let parsedData: undefined | z.infer<typeof RoomsSchema>;
  let parseError: Error | undefined;

  if (data) {
    try {
      const dataToValidate = data.data !== undefined ? data.data : data;
      parsedData = RoomsSchema.parse(dataToValidate);
    } catch (e) {
      if (e instanceof ZodError) {
        console.error('Zod parsing error:', e.errors);
        parseError = new Error(
          `Data validation failed: ${e.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')}`,
        );
      } else {
        console.error('Unexpected error during parsing:', e);
        parseError = new Error('An unexpected error occurred while parsing the data');
      }
    }
  }

  return {
    rooms: parsedData,
    isError: error || parseError,
    isLoading,
    mutate,
  };
};

export default useAllRoomData;
