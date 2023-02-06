import { StyleSheet, View, Text } from "react-native";
import Collapsible from "react-native-collapsible";
import FilteredOrderDetails from "../FilteredOrderDetails";

interface CollapsibleOrderProps {
   setOutstandingCollapsible: React.Dispatch<React.SetStateAction<boolean>>;
   outstandingCollapsible: boolean;
   outstandingOrders: OrderWithChowDetails[];
   children: React.ReactNode;
}

const CollapsibleOrder = ({
   outstandingCollapsible,
   setOutstandingCollapsible,
   outstandingOrders,
   children,
}: CollapsibleOrderProps) => {
   const { collapsibleHeader } = styles;
   return (
      <View>
         <Text
            style={collapsibleHeader}
            onPress={() => setOutstandingCollapsible(!outstandingCollapsible)}
         >
            {children}
         </Text>
         <Collapsible collapsed={outstandingCollapsible}>
            <FilteredOrderDetails orders={outstandingOrders} />
         </Collapsible>
      </View>
   );
};

const styles = StyleSheet.create({
   collapsibleHeader: {
      paddingLeft: 20,
   },
});
export default CollapsibleOrder;
