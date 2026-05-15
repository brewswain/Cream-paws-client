import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

import { getUserVisibleHttpMessage } from "../lib/api/normalizedHttpError";
import { getCustomerWriteValidationFieldMap } from "../lib/customers/customerFormServerErrors";
import { postCustomerCreate } from "../lib/customers/postCustomerCreate";
import { queryClient } from "../lib/queryClient";
import { customerKeys } from "../lib/queryKeys";
import type { CustomerWriteRequest } from "../schemas/customerWrite";

export function useCreateCustomerMutation() {
  return useMutation({
    mutationFn: (body: CustomerWriteRequest) => postCustomerCreate(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: customerKeys.all });
      Toast.show({ type: "success", text1: "Customer created" });
    },
    onError: (err: unknown) => {
      if (Object.keys(getCustomerWriteValidationFieldMap(err)).length > 0) {
        return;
      }
      Toast.show({
        type: "error",
        text1: "Could not create customer",
        text2: getUserVisibleHttpMessage(err),
      });
    },
  });
}
