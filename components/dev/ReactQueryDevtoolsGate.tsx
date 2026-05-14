import { Platform } from "react-native";

/**
 * TanStack Devtools are DOM-based; keep them off native bundles and production.
 * Only `expo start --web` + `__DEV__` loads the module.
 */
export function ReactQueryDevtoolsGate() {
  if (!__DEV__ || Platform.OS !== "web") {
    return null;
  }
  const {
    ReactQueryDevtools,
  } = require("@tanstack/react-query-devtools") as typeof import("@tanstack/react-query-devtools");
  return <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />;
}
