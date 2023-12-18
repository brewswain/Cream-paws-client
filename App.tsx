import { useEffect, useState } from "react";

import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { loadFonts } from "./assets/fonts/loadFonts";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";

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
  }
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}
