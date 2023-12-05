import { StyleSheet, Text, View } from "react-native";
import { ChowFlavour } from "../models/chow";
import { RootTabScreenProps } from "../types";
import ChowFlavourDetails from "../components/details/ChowFlavourDetails";
import SettingsModal from "../components/modals/SettingsModal";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

interface ChowFlavourProps {
  navigation: RootTabScreenProps<"ChowDetails">;
  route: {
    params: { flavours: ChowFlavour[]; brand: string; brand_id: string };
  };
}

const ChowFlavourScreen = ({ navigation, route }: ChowFlavourProps) => {
  const [showModal, setShowModal] = useState(false);

  const { flavours, brand, brand_id } = route.params;
  const handleEdit = () => {};
  const handleDelete = (id: string) => {
    return;
  };

  return (
    <View>
      <Text style={styles.header}>{brand}</Text>
      {flavours.map((flavour) => (
        <ChowFlavourDetails
          key={flavour.flavour_id}
          flavour={flavour}
          brand_id={brand_id}
        />
      ))}

      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDeletion={() => handleDelete("placeholder for now")}
        handleEdit={handleEdit}
        deletionId={brand_id}
      />
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
