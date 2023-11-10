import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";

import Icon from "@expo/vector-icons/AntDesign";

import { getAllChow } from "../api/routes/stock";
import CreateChowModal from "../components/modals/CreateChowModal";
import ChowCard from "../components/cards/ChowCard";

const StockScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [chow, setChow] = useState<Chow[]>([]);
  const [customerReservedChow, setCustomerReservedChow] = useState<Chow[]>([]);
  const [unpaidChow, setUnpaidChow] = useState<Chow[]>([]);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const { container, buttonContainer, unpaidChowCard, paidChowCard } = styles;

  const openModal = () => {
    setShowModal(true);
  };

  const populateChowList = async () => {
    const response: Chow[] = await getAllChow();

    const customerReservedChow = response.filter(
      (item) => item.is_paid_for === true
    );
    const unpaidForChow = response.filter((item) => item.is_paid_for === false);

    setCustomerReservedChow(customerReservedChow);
    setUnpaidChow(unpaidForChow);
    setChow(response);
  };

  useEffect(() => {
    populateChowList();
  }, []);

  //   <Pressable onPress={() => setShowModal(true)}>
  //   <Icon
  //     name="trash-o"
  //     style={{ color: "white", marginLeft: 8, zIndex: 20 }}
  //     size={20}
  //   />
  // </Pressable>

  return (
    <View style={container}>
      <ScrollView>
        {unpaidChow.length > 0 ? (
          <View>
            {unpaidChow.map((chow) => {
              return (
                <ChowCard
                  unpaid
                  populateStockList={populateChowList}
                  chow={chow}
                  isDeleted={isDeleted}
                  setIsDeleted={setIsDeleted}
                  key={`${chow.id} - unpaid`}
                />
              );
            })}
          </View>
        ) : null}
        {customerReservedChow.length > 0 ? (
          <View>
            {customerReservedChow.map((chow) => (
              <ChowCard
                unpaid={false}
                populateStockList={populateChowList}
                chow={chow}
                isDeleted={isDeleted}
                setIsDeleted={setIsDeleted}
                key={`${chow.id} - paid`}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
      <Pressable style={buttonContainer} onPress={openModal}>
        <Icon name="plus" size={20} />
      </Pressable>
      <CreateChowModal
        isOpen={showModal}
        setShowModal={setShowModal}
        populateChowList={populateChowList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  unpaidChowCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#434949",
    marginBottom: 8,
    padding: 8,
    color: "white",
  },
  paidChowCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#434949",
    color: "white",
    marginBottom: 8,
    padding: 8,
  },
});

export default StockScreen;
