import axios from "axios";

import { NormalizedHttpError } from "../api/normalizedHttpError";
import {
  extractValidationFieldMessagesFromBody,
  mapCustomerApiKeysToFormPaths,
  type CustomerWritableFieldPath,
} from "../forms/validationResponseFields";

export function getCustomerWriteValidationFieldMap(
  error: unknown
): Partial<Record<CustomerWritableFieldPath, string>> {
  if (!(error instanceof NormalizedHttpError)) return {};
  if (error.category !== "validation") return {};
  if (!axios.isAxiosError(error.causeError)) return {};
  const data = error.causeError.response?.data;
  const raw = extractValidationFieldMessagesFromBody(data);
  return mapCustomerApiKeysToFormPaths(raw);
}
