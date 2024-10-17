import { createRef, useContext, useRef, useState } from "react";
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
// import { createChow } from "../../api";
import { createChowFlavour, findChow } from "../../api/routes/stock";
import {
  Chow,
  ChowFromSupabase,
  ChowFromSupabasePayload,
} from "../../models/chow";
import { StockContext } from "../../context/StockContext";
import { useChowStore } from "../../store/chowStore";

interface CreateChowProps {
  isOpen: boolean;
  setShowModal(booleanStatus: boolean): void;
  brand_id?: number;
}

const CreateChowModal = ({
  isOpen,
  setShowModal,
  brand_id,
}: CreateChowProps) => {
  const [chowPayload, setChowPayload] = useState<ChowFromSupabasePayload>({
    brand_name: "",
    flavours: [
      {
        varieties: [
          {
            size: 0,
            unit: "lb",
            wholesale_price: 0,
            retail_price: 0,
          },
        ],
        flavour_name: "",
      },
    ],
  });
  const [unitIndex, setUnitIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const stockDetails = useContext(StockContext);
  const { populateChowList } = stockDetails;
  const { fetchChows } = useChowStore();

  const navigation = useNavigation();

  const inputRef2 = createRef<TextInput>();
  const inputRef3 = createRef<TextInput>();
  const inputRef4 = createRef<TextInput>();
  const inputRef5 = createRef<TextInput>();

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
      brand_name: chowPayload?.brand_name || "",
      flavours: [
        ...chowPayload!.flavours,
        {
          varieties: [
            {
              size: 0,
              unit: "lb",
              wholesale_price: 0,
              retail_price: 0,
            },
          ],
          flavour_name: "",
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

  const addNewVarietyField = (flavourIndex: number, varietyIndex: number) => {
    const data = { ...chowPayload };
    const newField = {
      size: 0,
      unit:
        varietyIndex > 0
          ? data.flavours[flavourIndex].varieties[0].unit
          : ("lb" as const),
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
    if (chowPayload?.brand_name === undefined) {
      setErrors({ ...errors, message: "Brand info is required" });
      return false;
    }

    return true;
  };

  // TODO: check stock.ts -- functionality not yet implemented
  const handleChowCreation = async () => {
    await createChow(chowPayload);
    fetchChows();
  };

  const handleFlavourCreation = async () => {
    const flavourPayload = chowPayload.flavours;
    // ! used here since we're only going to run this method if we have  our brand_id
    chowPayload.id && (await createChowFlavour(chowPayload.id, flavourPayload));
    const data = await findChow(brand_id!);

    data &&
      navigation.navigate("ChowFlavour", {
        chow: data,
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
              <View key={varietyIndex}>
                <FormControl isRequired>
                  <FormControl.Label>Size</FormControl.Label>
                  <TextInput
                    style={input}
                    ref={inputRef3}
                    value={variety.size.toString()}
                    selectTextOnFocus
                    returnKeyType="next"
                    onSubmitEditing={() => inputRef4.current?.focus()}
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
                    {["lb", "kg", "oz"].map((unit, index) => {
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
                              ].unit = unit as "lb" | "kg" | "oz";

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
                    defaultValue={variety.wholesale_price.toString()}
                    onChange={(event) =>
                      handleChowVarietyChange(
                        event,
                        "wholesale_price",
                        flavourIndex,
                        varietyIndex
                      )
                    }
                    returnKeyType="next"
                    onSubmitEditing={() => inputRef5.current?.focus()}
                    blurOnSubmit={false}
                    ref={inputRef4}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormControl.Label>Retail Price</FormControl.Label>
                  <TextInput
                    selectTextOnFocus
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
                    ref={inputRef5}
                  />
                </FormControl>
                <View style={buttonContainer}>
                  <Button
                    style={button}
                    onPress={() =>
                      addNewVarietyField(flavourIndex, varietyIndex)
                    }
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
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      avoidKeyboard
      _overlay={{
        useRNModal: false,
        useRNModalOnAndroid: false,
      }}
    >
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
                selectTextOnFocus
                style={input}
                returnKeyType="next"
                onSubmitEditing={() => inputRef2.current?.focus()}
                blurOnSubmit={false}
                onChange={(event) => handleChowChange(event, "brand_name")}
              />
            </FormControl>
          )}
          <Text style={header}>Flavours</Text>

          {chowPayload.flavours.map((_, index) => {
            return (
              <View key={index}>
                <FormControl.Label mt={4}>Name</FormControl.Label>
                <TextInput
                  selectTextOnFocus
                  style={input}
                  defaultValue={chowPayload.flavours[index].flavour_name}
                  onChange={(event) =>
                    handleChowFlavourChange(event, "flavour_name", index)
                  }
                  returnKeyType="next"
                  onSubmitEditing={() => inputRef3.current?.focus()}
                  blurOnSubmit={false}
                  ref={inputRef2}
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
            // isDisabled={!validateFormEntry}
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
