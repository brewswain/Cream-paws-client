jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

/// <reference types="jest" />

import { queryClient } from "../lib/queryClient";
import { resetClientSession } from "../lib/session/resetClientSession";
import { useFinanceStore } from "../store/financeStore";
import { useOrderStore } from "../store/orderStore";
import { useTodaysOrdersStore } from "../store/todaysOrdersStore";

describe("resetClientSession", () => {
  beforeEach(() => {
    jest.spyOn(queryClient, "clear").mockImplementation(() => {});
    jest
      .spyOn((useFinanceStore as unknown as { persist: { clearStorage: () => Promise<void> } }).persist, "clearStorage")
      .mockResolvedValue(undefined);
    jest
      .spyOn((useOrderStore as unknown as { persist: { clearStorage: () => Promise<void> } }).persist, "clearStorage")
      .mockResolvedValue(undefined);
    jest
      .spyOn((useTodaysOrdersStore as unknown as { persist: { clearStorage: () => Promise<void> } }).persist, "clearStorage")
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("clears the react-query cache", async () => {
    await resetClientSession();
    expect(queryClient.clear).toHaveBeenCalled();
  });

  it("resets finance UI slice after session reset", async () => {
    useFinanceStore.setState({ showModal: true, targetIds: ["x"] });
    await resetClientSession();
    expect(useFinanceStore.getState().showModal).toBe(false);
    expect(useFinanceStore.getState().targetIds).toEqual([]);
  });
});
