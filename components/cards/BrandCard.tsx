import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteChow } from "../../api";
import { Chow, ChowFromSupabase } from "../../models/chow";
import SettingsModal from "../modals/SettingsModal";
import { StockContext } from "../../context/StockContext";

interface BrandCardProps {
  chow: ChowFromSupabase;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
}

const BrandCard = ({ chow, setIsDeleted }: BrandCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const stockDetails = useContext(StockContext);

  const { populateChowList } = stockDetails;

  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate("ChowFlavour", {
      chow,
    });
  };

  const handleEdit = () => {
    setShowModal(false);
    // navigation.navigate("EditChow", {
    //   brand_id: chow.id,
    // });

    console.log("Temporarily disabled till we allow users to edit brands");
  };

  const handleDelete = async (id: number) => {
    try {
      // setIsDeleted(false);
      await deleteChow(id);
      // setIsDeleted(true);
      populateChowList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.chowCard}
      onPress={() => handleNavigation()}
      onLongPress={() => setShowModal(true)}
    >
      <View>
        <Text style={styles.header}>{chow.brand_name}</Text>
        {chow.flavours.length > 0 ? (
          <Text style={styles.flavourDetails}>{`${chow.flavours.length} ${
            chow.flavours.length > 1 ? "flavours" : "flavour"
          }`}</Text>
        ) : (
          <Text style={styles.flavourDetails}>No Flavours added yet</Text>
        )}
      </View>
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleDeletion={handleDelete}
        handleEdit={handleEdit}
        deletionId={chow.id}
      />
    </TouchableOpacity>
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
    borderRadius: 6,
    borderColor: "#e3e3e3",
    borderWidth: 1,
    width: "90%",
    // backgroundColor: "#434949",
    backgroundColor: "#f9f9f9",

    marginBottom: 8,
    padding: 8,
    // color: "white",
    minHeight: 70,
  },
  header: {
    fontSize: 22,
    textAlign: "center",
    padding: 6,
  },

  flavourDetails: {
    color: "#6c747a",
    width: "100%",
    marginVertical: 2,
    marginLeft: 6,
  },
  icon: {
    marginRight: 30,
    color: "white",
  },
});

export default BrandCard;
