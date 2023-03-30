import { signUp } from "./routes/auth";
import { signIn } from "./routes/auth";
import { signOut } from "./routes/auth";
import { getCurrentUser } from "./routes/auth";

import { createCustomer } from "./routes/customers";
import { deleteCustomer } from "./routes/customers";
import { findCustomer } from "./routes/customers";
import { getAllCustomers } from "./routes/customers";
import { updateCustomer } from "./routes/customers";

import {} from "./routes/finances";

import { createOrder } from "./routes/orders";
import { deleteOrder } from "./routes/orders";
import { updateOrder } from "./routes/orders";
import { getAllOrders } from "./routes/orders";

import { createChow } from "./routes/stock";
import { updateChow } from "./routes/stock";
import { deleteChow } from "./routes/stock";
import { getAllChow } from "./routes/stock";

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
   createChow,
   updateChow,
   deleteChow,
   getAllChow,
};
