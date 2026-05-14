import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { putCustomerUpdate } from "../lib/customers/putCustomerUpdate";
import { queryClient } from "../lib/queryClient";
import { customerKeys } from "../lib/queryKeys";
import type { CustomerWriteRequest } from "../schemas/customerWrite";

export function useUpdateCustomerMutation() {
  return useMutation({
    mutationFn: (args: { id: string | number; body: CustomerWriteRequest }) =>
      putCustomerUpdate(args.id, args.body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
      Toast.show({ type: "success", text1: "Customer updated" });
    },
    onError: (err: unknown) => {
      Toast.show({
        type: "error",
        text1: "Could not update customer",
        text2: err instanceof Error ? err.message : String(err),
      });
    },
  });
}
