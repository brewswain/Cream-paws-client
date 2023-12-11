import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteChow } from "../../api";
import { Dispatch, SetStateAction, useState } from "react";
import SettingsModal from "../modals/SettingsModal";
import { Chow } from "../../models/chow";

interface BrandCardProps {
  chow: Chow;
  populateStockList: () => void;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
}

const BrandCard = ({
  chow,
  populateStockList,
  setIsDeleted,
}: BrandCardProps) => {
  const [showModal, setShowModal] = useState(false);

  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate("ChowFlavour", {
      flavours: chow.flavours,
      brand: chow.brand,
      brand_id: chow.brand_id!,
      populateChowList: populateStockList,
    });
  };

  const handleEdit = () => {
    setShowModal(false);
    navigation.navigate("EditChow", {
      brand_id: chow.brand_id!,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleted(false);
      await deleteChow(id);
      setIsDeleted(true);
      populateStockList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Pressable style={styles.chowCard} onPress={() => handleNavigation()}>
      <Text style={styles.header}>{chow.brand}</Text>
      <Pressable onPress={() => setShowModal(true)}>
        <Icon
          name="ellipsis-h"
          size={20}
          style={{ padding: 12, color: "white" }}
        />
      </Pressable>
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDeletion={handleDelete}
        handleEdit={handleEdit}
        deletionId={chow.brand_id}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
  chowCard: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#434949",
    marginBottom: 8,
    padding: 8,
    color: "white",
    minHeight: 70,
  },
  header: {
    fontSize: 26,
    textAlign: "center",
    padding: 6,
    color: "#e6e3e3",
  },

  icon: {
    marginRight: 30,
    color: "white",
  },
});

export default BrandCard;
