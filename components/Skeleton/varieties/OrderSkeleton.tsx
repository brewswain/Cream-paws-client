import { StyleSheet, View } from "react-native";

import { PlainSkeletonBar } from "../PlainSkeletonBar";

const OrderSkeleton = () => {
	return (
		<View style={styles.container}>
			<PlainSkeletonBar width="30%" height={25} />
			<PlainSkeletonBar width="50%" height={15} />
			<PlainSkeletonBar width="20%" height={23} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "space-between",
		alignSelf: "center",
		borderRadius: 4,
		width: "90%",
		gap: 8,
		padding: 12,
		height: 120,
	},
});

export default OrderSkeleton;
