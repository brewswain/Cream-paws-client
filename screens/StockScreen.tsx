import { useCallback, useContext, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import Icon from "@expo/vector-icons/AntDesign";

import { useFocusEffect } from "@react-navigation/native";

import { generateSkeletons } from "../components/Skeleton/Skeleton";
import BrandCard from "../components/cards/BrandCard";
import CreateChowModal from "../components/modals/CreateChowModal";
import { StockContext } from "../context/StockContext";

const StockScreen = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean | null>(null);

  const stockDetails = useContext(StockContext);
  const { isLoading, chows, populateChowList } = stockDetails;

  const { container, buttonContainer } = styles;

  const openModal = () => {
    setShowModal(true);
  };

  useFocusEffect(
    useCallback(() => {
      populateChowList();
    }, [isDeleted])
  );

  return (
    <View style={container}>
      {isLoading ? (
        generateSkeletons({ count: 10, type: "ChowSkeleton" })
      ) : (
        <ScrollView>
          {chows.length > 0 ? (
            <View>
              {chows.map((chow) => {
                return (
                  <BrandCard
                    setIsDeleted={setIsDeleted}
                    chow={chow}
                    key={chow.brand_id}
                  />
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      )}
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
