import { useState, useEffect } from "react";

import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NativeBaseProvider } from "native-base";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { loadFonts } from "./assets/fonts/loadFonts";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadFonts();
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
