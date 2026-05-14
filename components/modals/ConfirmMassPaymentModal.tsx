import { Text } from "react-native";

import { Button, Modal } from "native-base";
import { useFinanceStore } from "../../store/financeStore";

interface ConfirmMassPaymentModalProps {
  showModal: boolean;
  handlePress: (orderIds: string[]) => void;
  isCourierFees: boolean;
  onAfterPayment?: () => void;
}

const ConfirmMassPaymentModal = ({
  showModal,
  handlePress,
  isCourierFees,
  onAfterPayment,
}: ConfirmMassPaymentModalProps) => {
  const { setShowModal, targetIds } = useFinanceStore();

  return (
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      avoidKeyboard
      _overlay={{ useRNModal: false, useRNModalOnAndroid: false }}
    >
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Payment Confirmation</Modal.Header>
        <Modal.Body>
          <Text>Confirm that you want to pay all orders:</Text>
          <Button
            colorScheme="danger"
            style={{ marginTop: 60, width: 200, alignSelf: "center" }}
            onPress={() => {
              handlePress(targetIds);
              setShowModal(false);
              onAfterPayment?.();
            }}
          >
            {isCourierFees ? "Pay all courier fees" : "Pay all orders"}
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default ConfirmMassPaymentModal;
