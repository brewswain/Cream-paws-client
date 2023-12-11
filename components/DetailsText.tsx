import { StyleSheet, Text, View } from "react-native";

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
	const { container, bold, regular } = styles;

	return (
		<View style={container}>
			<Text style={[bold, { paddingBottom: 6, color }]}>{header}: </Text>
			<Text style={regular}>{details}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		minWidth: "60%",
		maxWidth: 250,
		justifyContent: "space-between",
	},
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
