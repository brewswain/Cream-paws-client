import { StyleSheet, View } from "react-native";

import { PlainSkeletonBar } from "./PlainSkeletonBar";
import CustomerSkeleton from "./varieties/CustomerSkeleton";
import OrderSkeleton from "./varieties/OrderSkeleton";

interface SkeletonProps {
	type: "CustomerSkeleton" | "OrderSkeleton";
	count?: number;
}

export const generateSkeletons = ({ count, type }: SkeletonProps) => {
	const skeletons = Array.from({ length: count || 1 }, (_, index) => (
		<NativeSkeleton key={index} type={type} />
	));
	return skeletons;
};

const NativeSkeleton = ({ type }: SkeletonProps) => {
	switch (type) {
		case "CustomerSkeleton":
			return <CustomerSkeleton />;

		case "OrderSkeleton":
			return <OrderSkeleton />;

		default:
			return (
				<View style={fallbackStyles.box}>
					<PlainSkeletonBar width={300} height={200} />
				</View>
			);
	}
};

const fallbackStyles = StyleSheet.create({
	box: { alignSelf: "center" },
});

export default NativeSkeleton;
