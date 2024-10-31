import { useCallback, useEffect, useState } from "react";
import * as eva from "@eva-design/eva";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ApplicationProvider } from "@ui-kitten/components";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { useFonts } from "expo-font";

import * as SplashScreen from "expo-splash-screen";
import { CustomerDetailsProvider } from "./context/CustomerDetailsContext";
import { StockContextProvider } from "./context/StockContext";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Poppins: require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-semibold": require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-bold": require("./assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <SafeAreaProvider>
        <NativeBaseProvider>
          <CustomerDetailsProvider>
            <StockContextProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </StockContextProvider>
          </CustomerDetailsProvider>
        </NativeBaseProvider>
      </SafeAreaProvider>
    </ApplicationProvider>
  );
}
