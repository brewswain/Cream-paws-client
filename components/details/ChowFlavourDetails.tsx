import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Chow,
  ChowFlavour,
  ChowFlavourFromSupabase,
  ChowFromSupabase,
} from "../../models/chow";
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import Collapsible from "react-native-collapsible";
import Dinero from "dinero.js";
import { Divider } from "native-base";
import DetailsText from "../DetailsText";
import SettingsModal from "../modals/SettingsModal";
import { useNavigation } from "@react-navigation/native";
import {
  deleteChowFlavour,
  findChow,
  getAllChow,
} from "../../api/routes/stock";

interface ChowFlavourDetailsProps {
  flavour: ChowFlavourFromSupabase;
  brand_id: number;
}

const ChowFlavourDetails = ({ flavour, brand_id }: ChowFlavourDetailsProps) => {
  const [varietyCollapsible, setVarietyCollapsible] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [varietyIndex, setVarietyIndex] = useState(0);

  const navigation = useNavigation();

  const { dropdownContainer, dropdownIcon, dropdownText } = styles;
  const { flavour_name, varieties } = flavour;

  const handleEdit = () => {
    setShowModal(false);
    navigation.navigate("EditChow", {
      flavour,
    });
  };

  const handleDelete = async (flavour_id: number) => {
    await deleteChowFlavour(flavour_id);
    const data: ChowFromSupabase = await findChow(brand_id);

    navigation.navigate("ChowFlavour", {
      chow: data,
    });
  };

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <View style={{ marginVertical: 4, minHeight: 50 }}>
      <TouchableOpacity
        style={dropdownContainer}
        onPress={() => {
          setVarietyCollapsible(!varietyCollapsible);
        }}
        onLongPress={() => openModal()}
      >
        <Text style={dropdownText}>{flavour_name}</Text>
        <Icon
          name={`${varietyCollapsible ? "caret-right" : "caret-down"}`}
          size={20}
          style={dropdownIcon}
        />
      </TouchableOpacity>
      <Collapsible collapsed={varietyCollapsible}>
        <View
          style={[
            styles.buttonContainer,
            {
              justifyContent: varieties.length > 1 ? "space-between" : "center",
            },
          ]}
        >
          {varieties.map((variety, index) => {
            const isActiveButton = index === varietyIndex;
            return (
              <View key={`${variety.chow_id}${variety.size}${variety.unit}`}>
                {/* make button press set active variety, using index */}
                <Pressable
                  style={[
                    styles.button,
                    isActiveButton
                      ? styles.activeButton
                      : styles.inactiveButton,
                  ]}
                  onPress={() => setVarietyIndex(index)}
                >
                  <Text
                    style={{ color: isActiveButton ? "white" : "black" }}
                  >{`${variety.size} ${variety.unit}`}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <View style={{ paddingBottom: 12 }}>
          <DetailsText
            header="Wholesale Price"
            details={Dinero({
              amount: Math.round(varieties[varietyIndex].wholesale_price * 100),
            }).toFormat("$0,0.00")}
            color="black"
          />
          <DetailsText
            header="Retail Price"
            details={Dinero({
              amount: Math.round(varieties[varietyIndex].retail_price * 100),
            }).toFormat("$0,0.00")}
            color="black"
          />
        </View>
      </Collapsible>
      <Divider />
      <SettingsModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleEdit={handleEdit}
        handleDeletion={handleDelete}
        deletionId={flavour.flavour_id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  dropdownText: {
    fontSize: 18,
    width: "90%",
  },
  dropdownIcon: {
    paddingLeft: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
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

export default ChowFlavourDetails;
