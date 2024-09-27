'use client';

import { RoomWithRoomUserAndUserAndQuestionSchema } from '@/lib/schemas';
import useSWR from 'swr';
import { z, ZodError } from 'zod';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useAllRoomData = (roomId: string) => {
  const { data, error, isLoading, mutate } = useSWR(`/api/room/${roomId}`, fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 1000,
  });

  let parsedData: undefined | z.infer<typeof RoomWithRoomUserAndUserAndQuestionSchema>;
  let parseError: Error | undefined;

  if (data) {
    try {
      const dataToValidate = data.data !== undefined ? data.data : data;
      parsedData = RoomWithRoomUserAndUserAndQuestionSchema.parse(dataToValidate);
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
    roomInfo: parsedData,
    isError: error || parseError,
    isLoading,
    mutate,
  };
};

export default useAllRoomData;
