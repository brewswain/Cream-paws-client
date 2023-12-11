import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/FontAwesome";

import FilteredOrderDetails from "../FilteredOrderDetails";

interface CollapsibleOrderProps {
	setOutstandingCollapsible: React.Dispatch<React.SetStateAction<boolean>>;
	outstandingCollapsible: boolean;
	outstandingOrders: OrderWithChowDetails[];
	children: React.ReactNode;
}

const CollapsibleOrder = ({
	outstandingCollapsible,
	setOutstandingCollapsible,
	outstandingOrders,
	children,
}: CollapsibleOrderProps) => {
	const { dropdownContainer, dropdownIcon, dropdownText } = styles;
	return (
		<View>
			<TouchableOpacity
				style={dropdownContainer}
				onPress={() => {
					setOutstandingCollapsible(!outstandingCollapsible);
				}}
			>
				<Text style={dropdownText}>{children}</Text>
				<Icon
					name={`${outstandingCollapsible ? "caret-right" : "caret-down"}`}
					size={20}
					style={dropdownIcon}
				/>
			</TouchableOpacity>

			<Collapsible collapsed={outstandingCollapsible}>
				<FilteredOrderDetails orders={outstandingOrders} />
			</Collapsible>
		</View>
	);
};

const styles = StyleSheet.create({
	dropdownContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-around",
		backgroundColor: "white",
		padding: 4,
		borderRadius: 4,
		width: "70%",
		marginBottom: 10,
		marginLeft: 20,
	},
	dropdownText: {
		// TODO: font family+ aliasing please for the love of god
		fontSize: 16,
	},
	dropdownIcon: {
		paddingLeft: 20,
	},
});
export default CollapsibleOrder;
