import axios from "axios";
import Updates from "expo-updates";
import { LogLevel, OneSignal } from "react-native-onesignal";

const oneSignalAppId = process.env.ONESIGNAL_APP_ID;

// OneSignal Initialization
if (oneSignalAppId) {
  OneSignal.initialize(oneSignalAppId);
} else {
  console.error("ONESIGNAL_APP_ID is not defined.");
}

OneSignal.Debug.setLogLevel(LogLevel.Verbose);

// const sendPushNotification = async () => {
//     try {
//       // Customize the notification content
//       const notificationContent = {
//         contents: {
//           en: "A new app update is available!",
//         },
//         headings: {
//           en: "Update Available",
//         },
//         // Add any other notification options you need
//         // ...
//       };

//       // Send the push notification
//       const result = await OneSignal.Notifications.(notificationContent);

//       if (result) {
//         console.log("Push notification sent successfully:", result);
//       } else {
//         console.error("Failed to send push notification.");
//       }
//     } catch (error) {
//       console.error("Error sending push notification:", error);
//     }
//   };

// Function to send a push notification (triggered from your server/cloud function)
const sendUpdatePushNotification = async () => {
  const options = {
    method: "POST",
    url: "https://onesignal.com/api/v1/notifications",
    headers: {
      accept: "application/json",
      Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}`,
      "content-type": "application/json",
    },
    data: {
      included_segments: ["Subscribed Users"],
      contents: {
        en: "New update detected! App will refresh when it's installed.",
      },
      name: "UPDATE_DETECTED",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
  // Make an API request to your server/cloud function
};

// Function to manually check for updates
export const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      sendUpdatePushNotification();
      // An update is available, you can choose to download and apply it.
      await Updates.fetchUpdateAsync();
      // Reload the app to apply the update
      await Updates.reloadAsync();
    } else {
      // No updates are available
      console.log("No updates available");
    }
  } catch (error) {
    // Handle error
    console.error("Error checking for updates:", error);
  }
};
