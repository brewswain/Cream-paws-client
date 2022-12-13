import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface CustomerCardProps {
   customer: Customer;
}
const CustomerCard = ({ customer }: CustomerCardProps) => {
   const { name } = customer;
   const { container, heading } = styles;

   const navigation = useNavigation();

   // Keeping this as reference for using Animations
   // Using https://reactnative.dev/docs/animated as reference here
   // const expandAnimation = useRef(new Animated.Value(75)).current;
   // const expandClickedView = () => {
   //    Animated.timing(expandAnimation, {
   //       toValue: height,
   //       duration: 300,
   //       easing: Easing.linear,

   //       useNativeDriver: false, // Add This line
   //    }).start();
   // };

   const handleClick = (id: string) => {
      navigation.navigate("CustomerDetails", customer);
   };

   return (
      <Pressable onPress={() => handleClick(customer.id)}>
         <View style={container}>
            <Text style={heading}>{name}</Text>
         </View>
      </Pressable>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
      borderBottomColor: "grey",
      borderBottomWidth: 1,
      alignSelf: "stretch",
      height: 75,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
   },

   heading: {
      fontSize: 14,
      fontWeight: "400",
   },
   subHeading: {
      fontSize: 14,
   },
});

export default CustomerCard;
