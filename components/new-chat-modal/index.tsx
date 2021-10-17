import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { useCreateChatMutation } from "hooks/mutations/useCreateChatMutation";

const NewChatModal = ({ onOpen, isOpen, onClose, userIp }) => {
  const [name, setName] = useState("");
  const createChatMutation = useCreateChatMutation();

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="first-name" isRequired>
              <FormLabel>Name of the chat</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First name"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              isDisabled={!name}
              colorScheme="twitter"
              mr={3}
              onClick={async () => {
                await createChatMutation.mutate({
                  name,
                  userIp,
                });
                onClose();
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChatModal;
