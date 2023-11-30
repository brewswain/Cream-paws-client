import { StyleSheet, Text, View } from "react-native";
import { ChowFlavour } from "../models/chow";
import { RootTabScreenProps } from "../types";
import ChowFlavourDetails from "../components/details/ChowFlavourDetails";

interface ChowFlavourProps {
  navigation: RootTabScreenProps<"ChowDetails">;
  route: {
    params: { flavours: ChowFlavour[]; brand: string; brand_id: string };
  };
}

const ChowFlavourScreen = ({ navigation, route }: ChowFlavourProps) => {
  const { flavours, brand, brand_id } = route.params;

  return (
    <View>
      <Text style={styles.header}>{brand}</Text>
      {flavours.map((flavour) => (
        <ChowFlavourDetails flavour={flavour} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
});

export default ChowFlavourScreen;
