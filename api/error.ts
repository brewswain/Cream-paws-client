import { PostgrestError } from "@supabase/supabase-js";

export const handleSupabaseError = (error: PostgrestError) => {
  console.error({
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
  throw new Error(`${(error.message, error.details, error.hint, error.code)}`);
};
