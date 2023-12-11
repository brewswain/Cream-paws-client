import { Skeleton } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

const ChowSkeleton = () => {
	return (
		<View style={styles.container}>
			<Skeleton width={"100%"} height={70} animation="wave" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignSelf: "center",
		alignItems: "center",
		borderRadius: 4,
		width: "90%",
		marginBottom: 8,
		padding: 8,
		minHeight: 70,
	},
});

export default ChowSkeleton;
