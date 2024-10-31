import { PostgrestError } from "@supabase/supabase-js";

export const logNewSupabaseError = (message: string, error: PostgrestError) => {
  console.error(
    { message },
    {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    }
  );
};
