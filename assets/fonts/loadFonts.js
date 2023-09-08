import * as Font from "expo-font";

export const loadFonts = async () => {
   // These initial fonts should cover what we need, feel free to add more as needed.
   // Also, this implementation scales with more intense
   await Font.loadAsync({
      Poppins: require("./Poppins/Poppins-Regular.ttf"),
      "Poppins-semibold": require("./Poppins/Poppins-SemiBold.ttf"),
      "Poppins-bold": require("./Poppins/Poppins-Bold.ttf"),
   });
};
