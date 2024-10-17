import { useEffect, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { Button, FormControl } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { findChow, updateChow, updateChowFlavour } from "../api/routes/stock";

import {
  Chow,
  ChowFlavourFromSupabase,
  ChowFromSupabase,
} from "../models/chow";
import { RootTabScreenProps } from "../types";
interface EditChowScreenProps {
  navigation: RootTabScreenProps<"EditChow">;
  route: {
    params: {
      flavour: ChowFlavourFromSupabase;
    };
  };
}

const EditChowScreen = ({ navigation, route }: EditChowScreenProps) => {
  const [chowPayload, setChowPayload] = useState<ChowFlavourFromSupabase>(
    route.params.flavour
  );
  const [unitIndex, setUnitIndex] = useState(0);
  const [specifiedFlavourIndex, setSpecifiedFlavourIndex] = useState(0);

  const navigate = useNavigation();

  const {
    input,
    confirmationButton,
    confirmationButtonContainer,
    button,
    buttonContainer,
    header,
  } = styles;

  const { flavour } = route.params;

  const addNewVarietyField = (varietyIndex: number) => {
    const data = { ...chowPayload };
    const newField = {
      size: 0,
      unit: varietyIndex > 0 ? data.varieties[0].unit : ("lb" as const),
      wholesale_price: 0,
      chow_id: data.varieties[0].chow_id,
      retail_price: 0,
    };

    data.varieties.push(newField);
    setChowPayload(data);
  };

  const removeVarietyField = (varietyIndex: number) => {
    const data = { ...chowPayload };

    data.varieties.splice(varietyIndex, 1);
    setChowPayload(data);
  };

  const renderVarietyForm = () => {
    return (
      <>
        {chowPayload.varieties.map((variety, varietyIndex) => {
          return (
            <View key={`${varietyIndex} ${variety.unit}`}>
              <FormControl isRequired>
                <FormControl.Label>Size</FormControl.Label>
                <TextInput
                  selectTextOnFocus
                  style={input}
                  value={variety.size ? variety.size.toString() : "0"}
                  onChange={(event) => {
                    const data = { ...chowPayload };
                    data.varieties[varietyIndex].size = Number(
                      event.nativeEvent.text
                    );
                    setChowPayload(data);
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Unit</FormControl.Label>

                <View style={styles.unitButtonContainer}>
                  {["lb", "kg", "oz"].map((unit, index) => {
                    const isActiveButton =
                      unit === chowPayload.varieties[varietyIndex].unit;

                    return (
                      <View key={unit}>
                        <Pressable
                          style={[
                            styles.unitButton,
                            isActiveButton
                              ? styles.activeButton
                              : styles.inactiveButton,
                          ]}
                          onPress={() => {
                            setUnitIndex(index);

                            const data = { ...chowPayload };

                            data.varieties[varietyIndex].unit = unit as
                              | "lb"
                              | "kg"
                              | "oz";

                            setChowPayload(data);
                          }}
                        >
                          <Text
                            style={{
                              color: isActiveButton ? "white" : "black",
                            }}
                          >
                            {unit}
                          </Text>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </FormControl>

              <FormControl isRequired>
                <FormControl.Label>Wholesale Price</FormControl.Label>
                <TextInput
                  selectTextOnFocus
                  style={input}
                  defaultValue={
                    variety.wholesale_price
                      ? variety.wholesale_price.toString()
                      : "0"
                  }
                  onChange={(event) => {
                    const data = { ...chowPayload };
                    data.varieties[varietyIndex].wholesale_price = Number(
                      event.nativeEvent.text
                    );
                    setChowPayload(data);
                  }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormControl.Label>Retail Price</FormControl.Label>
                <TextInput
                  selectTextOnFocus
                  style={input}
                  defaultValue={
                    variety.retail_price ? variety.retail_price.toString() : "0"
                  }
                  onChange={(event) => {
                    const data = { ...chowPayload };
                    data.varieties[varietyIndex].retail_price = Number(
                      event.nativeEvent.text
                    );
                    setChowPayload(data);
                  }}
                />
              </FormControl>
              <View style={buttonContainer}>
                <Button
                  style={button}
                  onPress={() => addNewVarietyField(varietyIndex)}
                  key={`flavourIndex: ${varietyIndex} AddField `}
                >
                  <Icon
                    name="plus"
                    size={10}
                    key={`flavourIndex: ${varietyIndex} PlusIcon `}
                  />
                </Button>
                <Button
                  isDisabled={chowPayload.varieties.length <= 1}
                  onPress={() => removeVarietyField(varietyIndex)}
                  key={`flavourIndex: ${varietyIndex} RemoveField `}
                >
                  <Icon
                    name="minus"
                    size={10}
                    key={`flavourIndex: ${varietyIndex} MinusIcon `}
                  />
                </Button>
              </View>
            </View>
          );
        })}
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      {chowPayload.flavour_id ? (
        <>
          <Text style={header}>Flavour</Text>
          <View>
            <FormControl.Label mt={4}>Name</FormControl.Label>
            <TextInput
              selectTextOnFocus
              style={input}
              defaultValue={chowPayload.flavour_name}
              onChange={(event) => {
                const data = { ...chowPayload };
                data.flavour_name = event.nativeEvent.text;
                setChowPayload(data);
              }}
            />
            <Text style={header}>Sizes</Text>
            {renderVarietyForm()}
          </View>
        </>
      ) : (
        <Text>Something went wrong, can't detect flavour.</Text>
      )}

      <Button.Group space={2} style={confirmationButtonContainer}>
        <Button variant="ghost" onPress={() => navigate.navigate("Stock")}>
          Cancel
        </Button>
        <Button
          style={confirmationButton}
          // onPress={() => handleUpdate()}
          // isDisabled={isEmpty}
        >
          Save
        </Button>
      </Button.Group>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    margin: 5,
    marginBottom: 8,
    marginTop: 0,
    paddingLeft: 10,
    width: 270,
    borderRadius: 4,
    backgroundColor: "hsl(240,57%,97%)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
  },
  button: {
    width: 40,
    height: 30,
    marginRight: 4,
    backgroundColor: "hsl(213,74%,54%)",
  },
  confirmationButtonContainer: {
    marginBottom: 4,
  },
  confirmationButton: {
    backgroundColor: "hsl(213,74%,54%)",
  },
  dropdown: {
    height: 30,
    paddingLeft: 10,
  },
  dropdownContainer: {
    margin: 5,
    marginBottom: 8,
    marginTop: 0,
    width: 270,
    borderRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
  },
  unitButtonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  unitButton: {
    width: 60,
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4939FF",
  },
  inactiveButton: {
    backgroundColor: "white",
  },
});

export default EditChowScreen;
