import { Text, StyleSheet } from "react-native";

interface DetailsTextProps {
  header: string;
  details: string | number;
  color?: string;
}

const DetailsText = ({
  header,
  details,
  color = "white",
}: DetailsTextProps) => {
  const { bold, regular } = styles;

  return (
    <Text style={[bold, { paddingBottom: 6, color }]}>
      {header}: 
      <Text style={regular}>{details}</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  bold: {
    fontWeight: "500",
    paddingLeft: 20,
    fontSize: 16,
    color: "grey",
  },
  regular: {
    fontWeight: "400",
    paddingLeft: 20,
    fontSize: 14,
  },
});

export default DetailsText;
