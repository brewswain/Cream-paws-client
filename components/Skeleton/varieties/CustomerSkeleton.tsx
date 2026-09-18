import { StyleSheet, View } from "react-native";

import { PlainSkeletonBar } from "../PlainSkeletonBar";

const CustomerSkeleton = () => {
	return (
		<View style={styles.container}>
			<PlainSkeletonBar width="90%" height={25} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignSelf: "center",
		borderRadius: 4,
		width: "90%",
		marginBottom: 8,
		padding: 8,
	},
});

export default CustomerSkeleton;
