import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import { RootTabScreenProps } from "../types";
import {
  SubFields,
  renderDetailInputs,
} from "../components/details/DetailScreenComponents";
import { updateChow } from "../api";
import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";

interface ChowDetailsProps {
  navigation: RootTabScreenProps<"ChowDetails">;
  route: {
    params: Chow;
  };
}

const ChowDetailsScreen = ({ navigation, route }: ChowDetailsProps) => {
  const [chowPayload, setChowPayload] = useState(route.params);

  const navigate = useNavigation();

  const handleChange = (name: string, value: string | number) => {
    setChowPayload((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    await updateChow(route.params.id, chowPayload);
    navigate.navigate("Stock");
  };

  const chowFields: SubFields[] = [
    { title: "Brand", content: chowPayload.brand, name: "brand" },
    { title: "Flavour", content: chowPayload.flavour, name: "flavour" },
    { title: "Size", content: chowPayload.size, name: "size" },
    { title: "Unit", content: chowPayload.unit, name: "unit" },
    {
      title: "Wholesale Price",
      content: chowPayload.wholesale_price,
      name: "wholesale_price",
    },
    {
      title: "Retail Price",
      content: chowPayload.retail_price,
      name: "retail_price",
    },
  ];

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {renderDetailInputs(chowFields, handleChange)}
      <Button
        colorScheme="danger"
        style={{
          marginTop: 20,
          width: 150,
          alignSelf: "center",
        }}
        onPress={() => handleUpdate()}
      >
        Update Order
      </Button>
    </View>
  );
};

export default ChowDetailsScreen;
