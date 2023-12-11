import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Dinero from "dinero.js";
import Collapsible from "react-native-collapsible";

import DetailsText from "./DetailsText";
import CollapsibleChowDetails from "./Dropdowns/CollapsibleChowDetails";

interface FilteredOrderDetailsProps {
	orders: OrderWithChowDetails[];
}

const FilteredOrderDetails = ({ orders }: FilteredOrderDetailsProps) => {
	const { orderContainer, divider } = styles;

	return (
		<View>
			{orders?.map((order: any, index: number) => {
				return (
					<View key={`${index} Chow ID:${order.id}`} style={orderContainer}>
						{/* Payment Made Block */}
						<DetailsText
							header="Summary"
							details={`${order.chow_details.brand}-${order.chow_details.size} ${order.chow_details.unit} x ${order.quantity}`}
						/>
						{/* <DetailsText
                     header="Customer Paid for Chow"
                     details={order.payment_made ? "Yes" : "No"}
                  /> */}
						{order.payment_made ? (
							<DetailsText header="Payment Date" details={order.payment_date} />
						) : (
							<DetailsText
								header="Outstanding Cost"
								details={Dinero({
									amount: Math.round(
										order.chow_details.retail_price * order.quantity * 100,
									),
								}).toFormat("$0,0.00")}
							/>
						)}
						{/* Is Delivery Block */}
						<DetailsText
							header="Delivery"
							details={order.is_delivery ? "Yes" : "No"}
						/>
						{order.is_delivery ? (
							<DetailsText
								header="Delivery Date"
								details={order.delivery_date}
							/>
						) : null}
						{/* Quantity Block */}
						<DetailsText header="Quantity" details={order.quantity} />
						{/* Driver/Warehouse Block */}
						<DetailsText
							header="Warehouse Paid"
							details={order.warehouse_paid ? "Yes" : "No"}
						/>
						<DetailsText
							header="Driver Paid"
							details={order.driver_paid ? "Yes" : "No"}
						/>
						<CollapsibleChowDetails
							chowDetails={order.chow_details}
							index={index}
						/>
					</View>
				);
			})}
			<View style={divider} />
		</View>
	);
};

const styles = StyleSheet.create({
	orderContainer: {
		paddingTop: 8,
		paddingBottom: 20,
		paddingLeft: 20,
		alignSelf: "stretch",
		borderBottomColor: "hsl(186, 52%, 61%)",
		borderBottomWidth: 1,
	},
	divider: {
		borderBottomColor: "grey",
		borderBottomWidth: 1,
		marginBottom: 12,
	},
});

export default FilteredOrderDetails;
