import { axiosInstance } from "./http";
export { axiosInstance } from "./http";

import { signUp } from "./routes/auth";
import { signIn } from "./routes/auth";
import { signOut } from "./routes/auth";
import { getCurrentUser } from "./routes/auth";

import { createCustomer } from "./routes/customers";
import { deleteCustomer } from "./routes/customers";
import { updateCustomer } from "./routes/customers";
import { findCustomer, getAllCustomers } from "../lib/customers/readCustomers";

import {} from "./routes/finances";

import { createOrder } from "./routes/orders";
import { deleteOrder } from "./routes/orders";
import { updateOrder } from "./routes/orders";
import { getAllOrders } from "./routes/orders";

export {
	signUp,
	signIn,
	signOut,
	getCurrentUser,
	createCustomer,
	deleteCustomer,
	findCustomer,
	getAllCustomers,
	updateCustomer,
	createOrder,
	deleteOrder,
	updateOrder,
	getAllOrders,
};
