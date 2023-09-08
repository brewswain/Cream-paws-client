import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";

import Icon from "react-native-vector-icons/AntDesign";

import { getAllChow } from "../api/routes/stock";
import CreateChowModal from "../components/modals/CreateChowModal";

const StockScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [chow, setChow] = useState<Chow[]>([]);
  const [customerReservedChow, setCustomerReservedChow] = useState<Chow[]>([]);
  const [unpaidChow, setUnpaidChow] = useState<Chow[]>([]);

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

  return (
    <View style={container}>
      <ScrollView>
        {unpaidChow.length > 0 ? (
          <View>
            {unpaidChow.map((chow) => (
              <View style={unpaidChowCard}>
                <Text
                  style={{ color: "white" }}
                >{`${chow.brand} - ${chow.flavour}`}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {customerReservedChow.length > 0 ? (
          <View>
            {customerReservedChow.map((chow) => (
              <View style={paidChowCard}>
                <Text
                  style={{ color: "white" }}
                >{`${chow.brand} - ${chow.flavour}`}</Text>
              </View>
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
