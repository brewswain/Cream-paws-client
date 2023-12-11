import { useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputChangeEventData,
  View,
} from "react-native";

import { Button, FormControl, Modal } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import { useNavigation } from "@react-navigation/native";
import { createChow } from "../../api";
import { createChowFlavour, findChow } from "../../api/routes/stock";
import { Chow } from "../../models/chow";

interface CreateChowProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  populateChowList(): void;
  brand_id?: string;
}

const CreateChowModal = ({
  isOpen,
  setShowModal,
  populateChowList,
  brand_id,
}: CreateChowProps) => {
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

  const [errors, setErrors] = useState({});

  const navigation = useNavigation();

  const {
    input,
    confirmationButton,
    confirmationButtonContainer,
    button,
    buttonContainer,
    header,
  } = styles;

  const addNewFlavourField = () => {
    setChowPayload({
      brand: chowPayload?.brand || "",
      flavours: [
        ...chowPayload.flavours,
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
  };

  const removeFlavourField = (index: number) => {
    const data = [...chowPayload.flavours];
    data.splice(index, 1);

    const newData = {
      ...chowPayload,
      flavours: data,
    };

    setChowPayload(newData);
  };

  const addNewVarietyField = (flavourIndex: number) => {
    const data = { ...chowPayload };
    const newField = {
      size: 0,
      unit: "lb" as const,
      wholesale_price: 0,
      retail_price: 0,
    };

    data.flavours[flavourIndex].varieties.push(newField);
    setChowPayload(data);
  };

  const removeVarietyField = (flavourIndex: number, varietyIndex: number) => {
    const data = { ...chowPayload };
    const targetFlavour = data.flavours[flavourIndex];

    targetFlavour.varieties.splice(varietyIndex, 1);
    setChowPayload(data);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChowChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string
  ) => {
    const data: any = { ...chowPayload };

    data[name] = event.nativeEvent.text;

    setChowPayload(data);
    return;
  };

  const handleChowFlavourChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string,
    index: number
  ) => {
    const data: any = { ...chowPayload };
    data.flavours[index][name] = event.nativeEvent.text;

    setChowPayload(data);
  };

  const handleChowVarietyChange = (
    event: NativeSyntheticEvent<TextInputChangeEventData>,
    name: string,
    flavourIndex: number,
    varietyIndex: number
  ) => {
    const data: any = { ...chowPayload };
    data.flavours[flavourIndex].varieties[varietyIndex][name] =
      event.nativeEvent.text;

    setChowPayload(data);
  };

  const validateFormEntry = () => {
    if (chowPayload?.brand === undefined) {
      setErrors({ ...errors, message: "Brand info is required" });
      return false;
    }

    return true;
  };

  const handleChowCreation = async () => {
    // Heavyhanded use of !, but we should never have undefined here
    await createChow(chowPayload!);
    populateChowList();
  };

  const handleFlavourCreation = async () => {
    const flavourPayload = chowPayload.flavours;
    // ! used here since we're only going to run this method if we have  our brand_id
    await createChowFlavour(brand_id!, flavourPayload);
    const data: Chow = await findChow(brand_id!);

    navigation.navigate("ChowFlavour", {
      flavours: data.flavours,
      brand: data.brand,
      brand_id: data.brand_id!,
    });
  };

  const handleSubmit = () => {
    if (brand_id) {
      handleFlavourCreation();
    } else {
      handleChowCreation();
    }

    closeModal();
  };

  const renderVarietyForm = (flavourIndex: number) => {
    return (
      <>
        {chowPayload.flavours[flavourIndex].varieties.map(
          (variety, varietyIndex) => {
            return (
              <View key={`${variety.chow_id} ${variety.size} ${variety.unit}`}>
                <FormControl isRequired>
                  <FormControl.Label>Size</FormControl.Label>
                  <TextInput
                    style={input}
                    defaultValue={variety.size.toString()}
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
                    defaultValue={variety.wholesale_price.toString()}
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
                    defaultValue={variety.retail_price.toString()}
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
    <Modal isOpen={isOpen} onClose={closeModal} avoidKeyboard>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>
          {brand_id ? "Create New Flavour" : "Create Chow Brand"}
        </Modal.Header>
        <Modal.Body>
          {!brand_id && (
            <FormControl isRequired>
              <FormControl.Label>Brand</FormControl.Label>
              <TextInput
                style={input}
                onChange={(event) => handleChowChange(event, "brand")}
              />
            </FormControl>
          )}
          <Text style={header}>Flavours</Text>

          {chowPayload.flavours.map((_, index) => {
            return (
              <View key={index}>
                <FormControl.Label mt={4}>Name</FormControl.Label>
                <TextInput
                  style={input}
                  defaultValue={chowPayload.flavours[index].flavour_name}
                  onChange={(event) =>
                    handleChowFlavourChange(event, "flavour_name", index)
                  }
                />
                <Text
                  style={header}
                >{`${chowPayload.flavours[index].flavour_name} Size Variations`}</Text>
                {renderVarietyForm(index)}

                <View style={buttonContainer}>
                  <Button
                    onPress={() => addNewFlavourField()}
                    key={`index: ${index} AddField `}
                  >
                    New Flavour
                  </Button>
                  <Button
                    isDisabled={chowPayload.flavours.length <= 1}
                    onPress={() => removeFlavourField(index)}
                    key={`index: ${index} RemoveField `}
                  >
                    Remove Flavour
                  </Button>
                </View>
              </View>
            );
          })}
        </Modal.Body>
        <Button.Group space={2} style={confirmationButtonContainer}>
          <Button variant="ghost" onPress={closeModal}>
            Cancel
          </Button>
          <Button
            style={confirmationButton}
            onPress={() => handleSubmit()}
            isDisabled={!validateFormEntry}
          >
            Save
          </Button>
        </Button.Group>
      </Modal.Content>
    </Modal>
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

export default CreateChowModal;
