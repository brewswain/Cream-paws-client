import { StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import NavigationCard from "../components/NavigationCard";
import { RootTabScreenProps } from "../types";

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
   return (
      <View style={styles.container}>
         <Text style={styles.title}>Home</Text>

         <NavigationCard navigation={navigation} destination="Auth">
            Auth
         </NavigationCard>
         <NavigationCard navigation={navigation} destination="Customers">
            Customers
         </NavigationCard>
         <NavigationCard navigation={navigation} destination="Orders">
            Orders
         </NavigationCard>
         <NavigationCard navigation={navigation} destination="Stock">
            Stock
         </NavigationCard>
         <NavigationCard navigation={navigation} destination="Finance">
            Finance
         </NavigationCard>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
   },
});
