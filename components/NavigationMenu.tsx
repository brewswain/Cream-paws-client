import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootTabScreenProps } from "../types";

import NavigationCard from "./cards/NavigationCard";

interface NavigationMenuProps {
	navigation: any;
}
const NavigationMenu = ({ navigation }: NavigationMenuProps) => {
	const { container, flexColumn, flexRow } = styles;

	return (
		<View style={container}>
			<View style={flexColumn}>
				<View style={flexRow}>
					<NavigationCard navigation={navigation} destination="Customers">
						Customers
					</NavigationCard>
					<NavigationCard navigation={navigation} destination="Orders">
						Orders
					</NavigationCard>
				</View>
				<View style={flexRow}>
					<NavigationCard navigation={navigation} destination="Stock">
						Stock
					</NavigationCard>
					<NavigationCard navigation={navigation} destination="Finance">
						Finance
					</NavigationCard>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		borderTopRightRadius: 26,
		borderTopLeftRadius: 26,
		width: "100%",
		height: "40%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "white",
	},
	flexColumn: {
		display: "flex",
		flexDirection: "column",
	},
	flexRow: {
		display: "flex",
		flexDirection: "row",
	},
	navButton: {
		backgroundColor: "#FBFBFB",
	},
});

export default NavigationMenu;
