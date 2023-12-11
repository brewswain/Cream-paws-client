import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

import { FormControl, Button } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { findChow, updateChow, updateChowFlavour } from "../api/routes/stock";

import { RootTabScreenProps } from "../types";
import { Chow } from "../models/chow";
import { useNavigation } from "@react-navigation/native";

interface EditChowScreenProps {
  navigation: RootTabScreenProps<"EditChow">;
  route: {
    params: {
      brand_id: string;
      flavour_id?: string;
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

  const { brand_id, flavour_id } = route.params;
  const isEmpty = !Object.values(chowPayload).some(
    (x) => x !== null && x !== ""
  );

  const handleChowChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string
  ) => {
    let data: any = { ...chowPayload };

    data[name] = event.nativeEvent.text;

    setChowPayload(data);
    return;
  };

  const addNewVarietyField = (flavourIndex: number) => {
    const data = { ...chowPayload };
    const newField = {
      size: 0,
      unit: "lb" as "lb",
      wholesale_price: 0,
      retail_price: 0,
    };

    data.flavours[flavourIndex].varieties.push(newField);
    setChowPayload(data);
  };

  const removeVarietyField = (flavourIndex: number, varietyIndex: number) => {
    let data = { ...chowPayload };
    const targetFlavour = data.flavours[flavourIndex];

    targetFlavour.varieties.splice(varietyIndex, 1);
    setChowPayload(data);
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

  const getChow = async () => {
    const data = await findChow(brand_id);
    const flavourIndex = data.flavours.findIndex(
      (flavour: any) => flavour.flavour_id === flavour_id
    );
    setChowPayload(data);
    setSpecifiedFlavourIndex(flavourIndex);
  };

  const handleUpdate = async () => {
    if (flavour_id) {
      await updateChowFlavour(chowPayload.flavours[specifiedFlavourIndex]);
      navigate.navigate("ChowFlavour", {
        flavours: chowPayload.flavours,
        brand: chowPayload.brand,
        brand_id: route.params.brand_id,
      });
    } else {
      await updateChow(brand_id, chowPayload);
      navigate.navigate("Stock");
    }

    getChow();
  };

  useEffect(() => {
    getChow();
  }, []);

  const renderVarietyForm = (flavourIndex: number) => {
    return (
      <>
        {chowPayload.flavours[flavourIndex].varieties.map(
          (variety, varietyIndex) => {
            return (
              <View key={`${varietyIndex} ${variety.size} ${variety.unit}`}>
                <FormControl isRequired>
                  <FormControl.Label>Size</FormControl.Label>
                  <TextInput
                    style={input}
                    defaultValue={variety.size ? variety.size.toString() : "0"}
                    onChange={(event) =>
                      handleChowVarietyChange(
                        event,
                        "size",
                        flavourIndex,
                        varietyIndex
                      )
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label>Unit</FormControl.Label>

                  <View style={styles.unitButtonContainer}>
                    {["lb", "kg"].map((unit, index) => {
                      const isActiveButton =
                        unit ===
                        chowPayload.flavours[flavourIndex].varieties[
                          varietyIndex
                        ].unit;

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

                              data.flavours[flavourIndex].varieties[
                                varietyIndex
                              ].unit = unit;

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
                    style={input}
                    defaultValue={
                      variety.wholesale_price
                        ? variety.wholesale_price.toString()
                        : "0"
                    }
                    onChange={(event) =>
                      handleChowVarietyChange(
                        event,
                        "wholesale_price",
                        flavourIndex,
                        varietyIndex
                      )
                    }
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label>Retail Price</FormControl.Label>
                  <TextInput
                    style={input}
                    defaultValue={
                      variety.retail_price
                        ? variety.retail_price.toString()
                        : "0"
                    }
                    onChange={(event) =>
                      handleChowVarietyChange(
                        event,
                        "retail_price",
                        flavourIndex,
                        varietyIndex
                      )
                    }
                  />
                </FormControl>
                <View style={buttonContainer}>
                  <Button
                    style={button}
                    onPress={() => addNewVarietyField(flavourIndex)}
                    key={`flavourIndex: ${varietyIndex} AddField `}
                  >
                    <Icon
                      name="plus"
                      size={10}
                      key={`flavourIndex: ${varietyIndex} PlusIcon `}
                    />
                  </Button>
                  <Button
                    isDisabled={
                      chowPayload.flavours[flavourIndex].varieties.length <= 1
                    }
                    onPress={() =>
                      removeVarietyField(flavourIndex, varietyIndex)
                    }
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
          }
        )}
      </>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <FormControl>
        <View style={{ alignItems: "center" }}>
          <FormControl.Label>Brand</FormControl.Label>
          <TextInput
            style={input}
            defaultValue={chowPayload.brand}
            onChange={(event) => handleChowChange(event, "brand")}
          />
        </View>
      </FormControl>

      {flavour_id && chowPayload.flavours.length > 0 ? (
        <>
          <Text style={header}>Flavour</Text>
          <View>
            <FormControl.Label mt={4}>Name</FormControl.Label>
            <TextInput
              style={input}
              defaultValue={
                chowPayload.flavours[specifiedFlavourIndex].flavour_name
              }
              onChange={(event) =>
                handleChowFlavourChange(
                  event,
                  "flavour_name",
                  specifiedFlavourIndex
                )
              }
            />
            <Text style={header}>
              {`${chowPayload.flavours[specifiedFlavourIndex].flavour_name} Size Variations`}
            </Text>
            {renderVarietyForm(specifiedFlavourIndex)}
          </View>
        </>
      ) : (
        <>
          <Text style={header}>Flavours</Text>
          {chowPayload.flavours.map((_, index) => {
            const currentFlavour = chowPayload.flavours[index];
            return (
              <View key={index}>
                <FormControl.Label mt={4}>Name</FormControl.Label>
                <TextInput
                  style={input}
                  defaultValue={currentFlavour.flavour_name}
                  onChange={(event) =>
                    handleChowFlavourChange(event, "flavour_name", index)
                  }
                />
                <Text
                  style={header}
                >{`${currentFlavour.flavour_name} Size Variations`}</Text>
                {renderVarietyForm(index)}
              </View>
            );
          })}
        </>
      )}
      <Button.Group space={2} style={confirmationButtonContainer}>
        <Button variant="ghost" onPress={() => navigate.navigate("Stock")}>
          Cancel
        </Button>
        <Button
          style={confirmationButton}
          onPress={() => handleUpdate()}
          isDisabled={isEmpty}
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
