import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as generateUUID } from 'uuid';
import {
  Flex,
  Box,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Text,
} from '@chakra-ui/react';
import imgNewEvent from '../assets/images/new-event.png';
import imgJoinEvent from '../assets/images/join-event.png';
import useModal from '../hooks/useModal';
import supabase from '../supabaseClient';

import { userContext } from '../contexts/User';

export default function Home() {
  const { isOpen: joinIsOpen, onOpen: joinOnOpen, onClose: joinOnClose } = useDisclosure();
  const { Modal: CreateModal, isOpen: createIsOpen, onOpen: createOnOpen } = useModal();
  const roomIdInputRef = useRef();
  const nameInputRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  const [roomIdInputIsFilled, setRoomIdInputIsFilled] = useState(false);

  async function createRoom(event) {
    event.preventDefault();
    const userId = generateUUID();
    const { data: [{ id: roomId }] } = await supabase.from('rooms').insert({
      owner: userId,
    });
    await supabase.from('users').insert({
      id: userId,
      name: nameInputRef.current.value,
      roomId,
    });
    setUser({
      id: userId,
      name: nameInputRef.current.value,
    });
    navigate(`/room/${roomId}`);
    localStorage.setItem('user', userId);
  }

  function joinRoom(event) {
    event.preventDefault();
    navigate(`/room/${roomIdInputRef.current.value}`);
  }

  return (
    <>
      <Flex
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        gap={8}
        padding={8}
        flexDirection={['column', 'row']}
      >
        <Box
          display="grid"
          gridTemplateRows="auto 8rem"
          background="gray.900"
          borderRadius="2xl"
          maxW="md"
        >
          <Image
            src={imgNewEvent}
            alt="Pessoas criando algo"
            borderTopRadius="2xl"
          />
          <Button
            onClick={createOnOpen}
            height="100%"
            borderRadius={0}
            borderBottomRadius="2xl"
            fontSize="2xl"
            background="gray.900"
          >
            Criar sala
          </Button>
        </Box>
        <Box
          display="grid"
          gridTemplateRows="auto 8rem"
          background="gray.900"
          borderRadius="2xl"
          maxW="md"
        >
          <Image
            src={imgJoinEvent}
            alt="Pessoas apresentando algo"
            borderTopRadius="2xl"
          />
          <Button
            onClick={joinOnOpen}
            height="100%"
            borderRadius={0}
            borderBottomRadius="2xl"
            fontSize="2xl"
            background="gray.900"
          >
            Entrar em sala
          </Button>
        </Box>
      </Flex>
      <Modal isOpen={joinIsOpen} onClose={joinOnClose} isCentered initialFocusRef={roomIdInputRef}>
        <ModalOverlay />
        <ModalContent background="gray.800">
          <ModalHeader>
            <Text fontSize="3xl">Entrar</Text>
            <Text fontSize="md">Insira o ID da sala</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={joinRoom} id="joinRoom">
              <Input
                type="text"
                placeholder="Ex.: bc908c08-dea8-485b-aa0c-07a784d3dcb6"
                ref={roomIdInputRef}
                onChange={({ target: { value } }) => setRoomIdInputIsFilled(!!value)}
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" disabled={!roomIdInputIsFilled} type="submit" form="joinRoom">Entrar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      { createIsOpen && (
        <CreateModal heading="Criar sala" subheading="Como gostaria de se identificar?">
          <form onSubmit={createRoom}>
            <input type="text" ref={nameInputRef} placeholder="Digite seu nome" />
          </form>
        </CreateModal>
      ) }
    </>
  );
}
