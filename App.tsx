import { useState, useEffect } from "react";

import { LogLevel, OneSignal } from "react-native-onesignal";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";

import { ONESIGNAL_APP_ID, ONESIGNAL_API_KEY } from "@env";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { loadFonts } from "./assets/fonts/loadFonts";
import { checkForUpdates } from "./utils";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const oneSignalAppId = process.env.ONESIGNAL_APP_ID;

  // OneSignal Initialization
  const initializeOneSignal = () => {
    if (ONESIGNAL_APP_ID) {
      const appId = ONESIGNAL_APP_ID;

      console.log(appId);
      OneSignal.initialize(ONESIGNAL_APP_ID);

      // OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    } else {
      console.error("ONESIGNAL_APP_ID is not defined.");
    }
  };

  useEffect(() => {
    loadFonts();
    initializeOneSignal();
    checkForUpdates();
    setFontLoaded(true);
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NativeBaseProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
  }
}
