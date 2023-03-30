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
   const { container, borderBottom } = styles;
   return (
      <View
         style={container}
         onTouchStart={() => {
            navigation.navigate(destination);
         }}
      >
         <Text style={borderBottom}>{children}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      padding: 20,
      borderRadius: 8,
      // shadowColor: "#000000",
      // shadowOffset: {
      //    width: 0,
      //    height: 0,
      // },
      // shadowOpacity: 0.07,
      // shadowRadius: 0.05,
      // elevation: 4,
      width: 140,
      height: 75,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: 8,
   },
   borderBottom: {
      borderBottomColor: "black",
      borderBottomWidth: 2,
   },
});

export default NavigationCard;
