import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as generateUUID } from 'uuid';
import {
  Flex, Box, Image, Button,
} from '@chakra-ui/react';
import imgNewEvent from '../assets/images/new-event.png';
import imgJoinEvent from '../assets/images/join-event.png';
import useModal from '../hooks/useModal';
import supabase from '../supabaseClient';

import { userContext } from '../contexts/User';

export default function Home() {
  const { Modal: JoinModal, isOpen: joinIsOpen, onOpen: joinOnOpen } = useModal();
  const { Modal: CreateModal, isOpen: createIsOpen, onOpen: createOnOpen } = useModal();
  const roomIdInputRef = useRef();
  const nameInputRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

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
            fontSize="lg"
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
            fontSize="lg"
            background="gray.900"
          >
            Entrar em sala
          </Button>
        </Box>
      </Flex>
      { joinIsOpen && (
        <JoinModal heading="Entrar" subheading="Insira o ID da sala">
          <form onSubmit={joinRoom}>
            <input
              type="text"
              placeholder="Ex.: bc908c08-dea8-485b-aa0c-07a784d3dcb6"
              ref={roomIdInputRef}
            />
            <Button type="submit">Entrar</Button>
          </form>
        </JoinModal>
      ) }
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
