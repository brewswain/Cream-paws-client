import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Button } from "native-base";
import { updateOrder } from "../api";
import {
	CustomInput,
	Header,
	SubFields,
	renderDetailInputs,
} from "../components/details/DetailScreenComponents";
import { RootTabScreenProps } from "../types";

interface OrderDetailsProps {
	navigation: RootTabScreenProps<"OrderDetails">;
	route: {
		params: OrderDetails;
	};
}

const OrderDetailsScreen = ({ navigation, route }: OrderDetailsProps) => {
	const [orderPayload, setOrderPayload] = useState({
		...route.params,
		id: route.params._id || "unknown id",
	});
	const navigate = useNavigation();

	// TODO: sanitize our inputs
	const handleChange = (name: string, value: string | number) => {
		if (name.includes("chow_details")) {
			const [nestedKey, propertyName] = name.split(".");

			setOrderPayload((prevState) => ({
				...prevState,
				[nestedKey]: {
					...prevState.chow_details,
					[propertyName]: value,
				},
			}));
		} else {
			setOrderPayload((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	const handleUpdate = async () => {
		await updateOrder(orderPayload);
		navigate.navigate("Orders");
	};

	const formatDate = (date: string) => {
		const formattedDate = new Date(date).toDateString();

		return formattedDate;
	};

	const formattedDeliveryDate = formatDate(orderPayload.delivery_date);

	const chowFields: SubFields[] = [
		{
			title: "Brand",
			content: orderPayload.chow_details.brand,
			name: "chow_details.brand",
		},
		{
			title: "Flavour",
			content: orderPayload.chow_details.flavour,
			name: "chow_details.flavour",
		},
		{
			title: "Size",
			content: orderPayload.chow_details.size,
			name: "chow_details.size",
		},
		{
			title: "Unit",
			content: orderPayload.chow_details.unit,
			name: "chow_details.unit",
		},
		{
			title: "Quantity",
			content: orderPayload.quantity,
			name: "quantity",
		},
	];

	const costsFields: SubFields[] = [
		{
			title: "Wholesale Price",
			content: orderPayload.chow_details.wholesale_price,
			name: "chow_details.wholesale_price",
		},
		{
			title: "Retail Price",
			content: orderPayload.chow_details.retail_price,
			name: "chow_details.retail_price",
		},
		{
			title: "Delivery Fee",
			content: "Add delivery fee dropdown here",
			name: "REPLACE_WHEN_WE_WORK_OUT_DATASHAPE",
		},
		{
			title: "Total Cost",
			content: "Calculate all costs in our API",
			name: "REPLACE_WHEN_WE_WORK_OUT_DATASHAPE",
		},
	];

	return (
		<View style={{ backgroundColor: "white", flex: 1 }}>
			<View style={{ width: "90%" }}>
				{/* Checkmarks like Driver Paid, etc */}
				<Text style={{ fontSize: 26, textAlign: "center", fontWeight: "600" }}>
					{orderPayload.client_name}
				</Text>

				<Header>Delivery Date</Header>
				{/*  ignore this error till we implement the date-selector */}
				{/* @ts-ignore */}
				<CustomInput handleChange={handleChange}>
					{formattedDeliveryDate}
				</CustomInput>

				<Header>Chow Details</Header>
				{renderDetailInputs(chowFields, handleChange)}

				{/* TODO:  Add driver fees here: remember that we want a dropdown of 4 different delivery fees */}
				<Header>Costs</Header>
				{renderDetailInputs(costsFields, handleChange)}
			</View>
			<Button
				colorScheme="danger"
				style={{
					marginTop: 20,
					width: 150,
					alignSelf: "center",
				}}
				onPress={() => handleUpdate()}
			>
				Update Order
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: "black",
		borderRadius: 6,
		paddingLeft: 12,
		marginHorizontal: 8,
		marginTop: 4,
	},
});

export default OrderDetailsScreen;
