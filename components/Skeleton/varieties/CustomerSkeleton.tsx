import { Skeleton } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

const CustomerSkeleton = () => {
	return (
		<View style={styles.container}>
			<Skeleton width={"90%"} height={25} animation="wave" />
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
