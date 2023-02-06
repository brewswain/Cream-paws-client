import { View, Text } from "react-native";
import Collapsible from "react-native-collapsible";
import DetailsText from "../DetailsText";

interface CollapsibleChowDetailsProps {
   chowDetails: Chow;
   isCollapsed: boolean;
   setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
   index: number;
}

const CollapsibleChowDetails = ({
   chowDetails,
   isCollapsed,
   setIsCollapsed,
   index,
}: CollapsibleChowDetailsProps) => {
   const { brand, target_group, flavour, size, unit, retail_price } =
      chowDetails;

   return (
      <View>
         <Text
            key={`${index} Collapsible`}
            onPress={() => {
               setIsCollapsed(!isCollapsed);
            }}
            style={{ paddingLeft: 20 }}
         >
            {isCollapsed ? "View Chow Details:" : "Close Chow Details:"}
         </Text>
         <Collapsible collapsed={isCollapsed}>
            <View>
               <DetailsText header={"Brand"} details={brand} />
               <DetailsText header={"Target Group"} details={target_group} />
               <DetailsText header={"Flavour"} details={flavour} />
               <DetailsText header={"Size"} details={`${size} ${unit}`} />
               <DetailsText header={"Cost"} details={retail_price} />
            </View>
         </Collapsible>
      </View>
   );
};

export default CollapsibleChowDetails;
