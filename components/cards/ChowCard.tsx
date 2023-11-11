import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { deleteChow } from "../../api";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteModal from "../modals/DeleteModal";
import SettingsModal from "../modals/SettingsModal";

interface ChowCardProps {
  chow: Chow;
  populateStockList: () => void;
  setIsDeleted: Dispatch<SetStateAction<boolean | null>>;
  isDeleted: boolean | null;
  unpaid: boolean;
}

const ChowCard = ({
  chow,
  populateStockList,
  setIsDeleted,
  isDeleted,
  unpaid,
}: ChowCardProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const navigation = useNavigation();

  const { buttonContainer, unpaidChowCard, paidChowCard, icon } = styles;

  const viewDetails = () => {
    navigation.navigate("ChowDetails", chow);
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
    <>
      <Pressable onPress={() => viewDetails()}>
        {unpaid ? (
          <View>
            <View style={unpaidChowCard} key={`unpaid-${chow.id}`}>
              <Text
                style={{ color: "white", paddingHorizontal: 26, width: "80%" }}
              >{`${chow.brand} - ${chow.flavour}`}</Text>
              <Pressable onPress={() => setShowModal(true)}>
                <Icon name="trash-o" size={20} style={icon} />
              </Pressable>
            </View>
          </View>
        ) : (
          <View>
            <View style={paidChowCard} key={`paid-${chow.id}`}>
              <Text
                style={{ color: "white", paddingHorizontal: 26, width: "80%" }}
              >{`${chow.brand} - ${chow.flavour}`}</Text>
              <Pressable onPress={() => setShowModal(true)}>
                <Icon name="trash-o" size={20} style={icon} />
              </Pressable>
            </View>
          </View>
        )}
      </Pressable>
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handlePress={handleDelete}
        deletionId={chow.id}
      />
    </>
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
  unpaidChowCard: {
    display: "flex",
    flexDirection: "row",
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
  paidChowCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#434949",
    color: "white",
    marginBottom: 8,
    padding: 8,
    minHeight: 70,
  },
  icon: {
    marginRight: 30,
    color: "white",
  },
});

export default ChowCard;
