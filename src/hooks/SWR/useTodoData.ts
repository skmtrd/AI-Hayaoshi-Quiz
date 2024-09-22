import useSWR from 'swr';
import { z, ZodError } from 'zod';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const useUserInfo = () => {
  const { data, error, isLoading, mutate } = useSWR('/api/todo', fetcher);
  const TodosSchema = z.array(TodoSchema);

  let parsedData: undefined | z.infer<typeof TodosSchema>;
  let parseError: Error | undefined;

  console.log('data:', data);

  if (data) {
    try {
      const dataToValidate = data.data !== undefined ? data.data : data;
      parsedData = TodosSchema.parse(dataToValidate);
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
    todos: parsedData,
    isError: error || parseError,
    isLoading,
    mutate,
  };
};

export default useUserInfo;
