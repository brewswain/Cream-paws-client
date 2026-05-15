import { resetClientSession } from "../../lib/session/resetClientSession";
import { axiosInstance } from "../http";

export const signUp = async (email: string, password: string) => {
	const response = await axiosInstance.post("/users/signup", {
		email,
		password,
	});
	return response;
};

export const signIn = async (email: string, password: string) => {
	const response = await axiosInstance.post("/users/signin", {
		email,
		password,
	});
	return response;
};

export const signOut = async () => {
	const response = await axiosInstance.post("/users/signout");
	await resetClientSession();
	return response.data;
};

export const getCurrentUser = async () => {
	const response = await axiosInstance.get("/users/currentuser");
	return response;
};
