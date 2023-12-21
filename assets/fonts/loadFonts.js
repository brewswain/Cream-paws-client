import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    Poppins: require("./Poppins/Poppins-Regular.ttf"),
    "Poppins-semibold": require("./Poppins/Poppins-SemiBold.ttf"),
    "Poppins-bold": require("./Poppins/Poppins-Bold.ttf"),
  });
};
