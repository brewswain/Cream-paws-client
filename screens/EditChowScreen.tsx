import {
  View,
  Text,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { RootStackParamList, RootTabScreenProps } from "../types";
import { useState } from "react";
import { Chow } from "../models/chow";

interface EditChowScreenProps {
  navigation: RootTabScreenProps<"EditChow">;
  route: {
    params: {
      brand_id: string;
      flavour_id: string;
    };
  };
}

const EditChowScreen = ({ navigation, route }: EditChowScreenProps) => {
  const [chowPayload, setChowPayload] = useState<Chow>({
    brand: "",
    flavours: [
      {
        flavour_name: "",
        varieties: [
          {
            size: 0,
            unit: "lb",
            wholesale_price: 0,
            retail_price: 0,
          },
        ],
      },
    ],
  });

  const { brand_id, flavour_id } = route.params;

  const handleChowChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string
  ) => {
    let data: any = { ...chowPayload };

    data[name] = event.nativeEvent.text;

    setChowPayload(data);
    return;
  };

  const handleChowFlavourChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string,
    index: number
  ) => {
    let data: any = { ...chowPayload };
    data.flavours[index][name] = event.nativeEvent.text;

    setChowPayload(data);
  };

  const handleChowVarietyChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string,
    flavourIndex: number,
    varietyIndex: number
  ) => {
    let data: any = { ...chowPayload };
    data.flavours[flavourIndex].varieties[varietyIndex][name] =
      event.nativeEvent.text;

    setChowPayload(data);
  };

  // TODO: potentially unnecessary, since when we pull our chow using our brand_id,
  // we can just use that as our payload and spread in our edited params, preventing the need for conditions.
  // Leaving it in for now just so that I can get a mental map to work with tomz
  const updateFullChow = () => {};
  const updateFlavourOrVariety = () => {};

  const updateChow = () => {
    if (flavour_id) {
      updateFlavourOrVariety();
    } else {
      updateFullChow();
    }
  };

  const renderChowDetails = () => {
    if (flavour_id) {
      return <Text>Edit Flavour chosen</Text>;
    } else return <Text>Edit Brand chosen</Text>;
  };

  // return <View>{renderChowDetails()}</View>;

  return <View></View>;
};

export default EditChowScreen;
