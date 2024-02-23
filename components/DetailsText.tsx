import { StyleSheet, Text, View } from "react-native";

interface DetailsTextProps {
  header: string;
  details: string | number;
  color?: string;
  paddingLeft?: number;
}

const DetailsText = ({
  header,
  details,
  color = "white",
  paddingLeft = 20,
}: DetailsTextProps) => {
  const { container, bold, regular } = styles;

  return (
    <View style={[container, { gap: 10 }]}>
      <Text style={[bold, { paddingBottom: 6, color, paddingLeft }]}>
        {header}: 
      </Text>
      <Text style={[regular, { color }]}>{details}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    minWidth: "60%",
    maxWidth: 250,
  },
  bold: {
    fontWeight: "500",
    fontSize: 16,
    color: "grey",
  },
  regular: {
    fontWeight: "400",
    fontSize: 14,
  },
});

export default DetailsText;
