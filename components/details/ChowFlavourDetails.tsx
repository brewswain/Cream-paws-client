import { View, Text } from "react-native";
import { ChowFlavour } from "../../models/chow";
import CollapsibleVariety from "../Dropdowns/Chow/CollabsibleVariety";
import { useState } from "react";

interface ChowFlavourDetailsProps {
  flavour: ChowFlavour;
}

const ChowFlavourDetails = ({ flavour }: ChowFlavourDetailsProps) => {
  const [varietyCollapsible, setVarietyCollapsible] = useState<boolean>(true);

  const { flavour_name, varieties } = flavour;
  return (
    <View>
      <CollapsibleVariety
        varietyCollapsible={varietyCollapsible}
        setVarietyCollapsible={setVarietyCollapsible}
        varieties={varieties}
      >
        {flavour_name}
      </CollapsibleVariety>
    </View>
  );
};

export default ChowFlavourDetails;
