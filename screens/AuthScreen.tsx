import { useState, useEffect } from "react";

import { Button, Text, View } from "react-native";
import { getCurrentUser, signIn, signOut, signUp } from "../api/routes/auth";

const AuthScreen = () => {
   const [currentUser, setCurrentUser] = useState();
   const [user, setUser] = useState();

   const signInTest = async () => {
      const response = await signIn("test13@test.com", "password");

      setUser(response);
   };

   useEffect(() => {
      console.log({ user });
   }, [user]);

   const getCurrentUserTest = async () => {
      const response = await getCurrentUser();
      console.log(response);
      setCurrentUser(response.currentUser);
   };

   const signOutTest = async () => {
      const response = await signOut();
      setUser(response);
   };
   return (
      <View>
         <Text>
            {user && user.email
               ? `User ${user.email} is signed in.`
               : "Please sign In!"}
         </Text>
         <Text>{`CurrentUserTest: ${currentUser}`}</Text>
         <Button
            title="Sign Up"
            onPress={() => {
               signUp("test@test.com", "password");
            }}
         />
         <Button
            title="Sign In"
            onPress={() => {
               signInTest();
            }}
         />
         <Button
            title="Sign Out"
            onPress={() => {
               signOutTest();
            }}
         />
         <Button
            title="Get Current User"
            onPress={() => {
               getCurrentUserTest();
            }}
         />
      </View>
   );
};

export default AuthScreen;
