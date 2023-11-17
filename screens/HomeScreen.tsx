import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";

import { Text } from "../components/Themed";
import NavigationCard from "../components/cards/NavigationCard";
import { RootTabScreenProps } from "../types";
import { NavigationMenu, TodayAtaGlanceCard } from "../components";
import { BottomTabNavigator } from "../navigation";

// Placed here to make available to Stylesheet
const screenHeight = Dimensions.get("window").height;

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const { safeAreaView, container } = styles;

  return (
    // <SafeAreaView style={safeAreaView}>
    //    <ScrollView>
    <View style={container}>
      <TodayAtaGlanceCard />
    </View>
    //    </ScrollView>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#252526",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: screenHeight,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
