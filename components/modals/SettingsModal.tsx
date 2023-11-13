import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, Text, View } from "react-native";
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

  const handleClose = () => {
    setShowModal(false);
    setShowConfirmationMessage(false);
  };

  return (
    <Modal isOpen={showModal} onClose={() => handleClose()}>
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
                <Pressable
                  style={{ flexDirection: "row" }}
                  onPress={() => setShowConfirmationMessage(true)}
                >
                  <Text style={{ fontSize: 20 }}>Delete</Text>
                  <MaterialIcon
                    name="delete-outline"
                    size={26}
                    style={{ paddingLeft: 20 }}
                  />
                </Pressable>
              ) : null}

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
