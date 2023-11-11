import { Dispatch, SetStateAction, useState } from "react";
import { Text, View } from "react-native";
import { Modal, Button } from "native-base";

import IonicIcon from "@expo/vector-icons/Ionicons";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

interface SettingsModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handlePress: (id: string) => void;
  deletionId?: string;
}

const SettingsModal = ({
  showModal,
  setShowModal,
  handlePress,
  deletionId,
}: SettingsModalProps) => {
  const [showConfirmationMessage, setShowConfirmationMessage] =
    useState<boolean>(false);
  const handleDelete = (deletionId: string | undefined) => {
    if (deletionId) {
      handlePress(deletionId);
    } else {
      console.error("Could not get id, please check your deletionId prop");
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header style={{ alignSelf: "center" }}>
          Item Settings
        </Modal.Header>
        <Modal.Body>
          <View style={{ gap: 12 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>Edit</Text>
              <IonicIcon
                name="settings-outline"
                size={26}
                style={{ paddingLeft: 20 }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
              {!showConfirmationMessage ? (
                <>
                  <Text style={{ fontSize: 20 }}>Delete</Text>
                  <MaterialIcon
                    name="delete-outline"
                    size={26}
                    style={{ paddingLeft: 20 }}
                    onPress={() => setShowConfirmationMessage(true)}
                    // onPress={() => handleDelete(deletionId)}
                  />
                </>
              ) : null}
              {/* <Button
              colorScheme="danger"
              style={{
                marginTop: 60,
                marginRight: 20,
                width: 100,
                alignSelf: "flex-end",
              }}
              onPress={() => checkForId(deletionId)}
            >
              Delete
            </Button> */}
              {showConfirmationMessage ? (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Text style={{ textAlign: "center" }}>
                    Please be careful as deletion is permanent.
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      colorScheme="danger"
                      style={{
                        marginTop: 20,
                        width: 100,
                        alignSelf: "flex-end",
                      }}
                      onPress={() => handleDelete(deletionId)}
                    >
                      Delete
                    </Button>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SettingsModal;
