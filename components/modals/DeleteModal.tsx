import { Button, Modal } from "native-base";
import { Dispatch, SetStateAction } from "react";
import { Text } from "react-native";

interface DeleteModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  handlePress: (id: string) => void;
  deletionId?: string;
  message: string;
}

const DeleteModal = ({
  showModal,
  setShowModal,
  handlePress,
  deletionId,
  message,
}: DeleteModalProps) => {
  const checkForId = (deletionId: string | undefined) => {
    if (deletionId) {
      handlePress(deletionId);
    } else {
      console.error("Could not get id, please check your deletionId prop");
    }
  };
  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      avoidKeyboard
      _overlay={{ useRNModal: false, useRNModalOnAndroid: false }}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Delete Confirmation</Modal.Header>
        <Modal.Body>
          <Text>{message}</Text>
          <Button
            colorScheme="danger"
            style={{ marginTop: 60, width: 100, alignSelf: "center" }}
            onPress={() => checkForId(deletionId)}
          >
            Delete
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default DeleteModal;
