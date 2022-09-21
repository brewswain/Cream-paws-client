import { StyleSheet, Text, View } from "react-native";

const CustomerCard = (customer: Customer) => {
   const { name, id, pets, orders } = customer;
   const { container, heading, subHeading } = styles;
   return (
      <View>
         <Text style={container}>{name}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
      borderRadius: 4,
      borderColor: "black",
      borderWidth: 1,
      width: 200,
      height: 75,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
   },
   heading: {
      fontSize: 18,
      fontWeight: "600",
   },
   subHeading: {
      fontSize: 14,
   },
});

export default CustomerCard;
