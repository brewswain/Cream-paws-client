import { Text, StyleSheet } from "react-native";

interface DetailsTextProps {
   header: string;
   details: string | number;
}

const DetailsText = ({ header, details }: DetailsTextProps) => {
   const { bold, regular } = styles;

   return (
      <Text style={[bold, { paddingBottom: 6 }]}>
         {header}: 
         <Text style={regular}>{details}</Text>
      </Text>
   );
};

const styles = StyleSheet.create({
   bold: {
      fontWeight: "600",
      paddingLeft: 20,
      fontSize: 16,
   },
   regular: {
      fontWeight: "400",
      paddingLeft: 20,
      fontSize: 14,
   },
});

export default DetailsText;
