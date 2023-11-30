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
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate("ChowFlavour", {
      flavours: chow.flavours,
      brand: chow.brand,
    });
  };

  return (
    <Pressable style={styles.chowCard} onPress={() => handleNavigation()}>
      <Text style={styles.header}>{chow.brand}</Text>
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
