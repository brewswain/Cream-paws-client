import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Icon from "@expo/vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";

import { CreateChowModal } from "../components";
import ChowFlavourDetails from "../components/details/ChowFlavourDetails";
import SettingsModal from "../components/modals/SettingsModal";
import { ChowFlavour } from "../models/chow";
import { RootTabScreenProps } from "../types";

interface ChowFlavourProps {
  navigation: RootTabScreenProps<"ChowDetails">;
  route: {
    params: {
      flavours: ChowFlavour[];
      brand: string;
      brand_id: string;
    };
  };
}

const ChowFlavourScreen = ({ navigation, route }: ChowFlavourProps) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);

  const openCreationModal = () => {
    setShowCreationModal(true);
  };
  const { flavours, brand, brand_id } = route.params;

  const sortedFlavours = flavours.sort((a, b) =>
    a.flavour_name.localeCompare(b.flavour_name)
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{brand}</Text>
      {sortedFlavours.map((flavour) => (
        <ChowFlavourDetails
          key={flavour.flavour_id}
          flavour={flavour}
          brand_id={brand_id}
        />
      ))}
      <Pressable style={styles.buttonContainer} onPress={openCreationModal}>
        <Icon name="plus" size={20} />
      </Pressable>

      <CreateChowModal
        isOpen={showCreationModal}
        setShowModal={setShowCreationModal}
        brand_id={brand_id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    height: 40,
    width: 40,
    bottom: 20,
    right: 10,
    borderRadius: 50,
    backgroundColor: "#8099c1",
  },
});

export default ChowFlavourScreen;
