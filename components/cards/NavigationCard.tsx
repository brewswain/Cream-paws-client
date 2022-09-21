import { StyleSheet, Text, View } from "react-native";

interface NavigationCardProps {
   children: string;
   destination: string;
   icon?: string;
   navigation: any;
   otherProps?: any;
}

const NavigationCard = ({
   children,
   destination,
   navigation,
   ...otherProps
}: NavigationCardProps) => {
   return (
      <View
         style={styles.container}
         onTouchStart={() => {
            navigation.navigate(destination);
         }}
      >
         <Text>{children}</Text>
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
});

export default NavigationCard;
