import { Skeleton } from "@rneui/themed";
import { View, StyleSheet } from "react-native";

const OrderSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton width={"30%"} height={25} animation="wave" />
      <Skeleton width={"50%"} height={15} animation="wave" />
      <Skeleton width={"20%"} height={23} animation="wave" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 4,
    width: "90%",
    gap: 8,
    padding: 12,
    height: 120,
  },
});

export default OrderSkeleton;
