import React, { useContext, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Heading,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';
import { userContext } from '../contexts/User';
import supabase from '../supabaseClient';

export default function Identification() {
  const { state } = useLocation();
  const [inputNameIsFilled, setInputNameIsFilled] = useState(false);
  const usernameInputRef = useRef();
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  async function joinRoom(event) {
    event.preventDefault();
    const { data: [{ id }] } = await supabase.from('users').insert({
      name: usernameInputRef.current.value,
      roomId: state.roomId,
    });
    localStorage.setItem('user', id);
    setUser({
      id,
      name: usernameInputRef.current.value,
    });
    navigate(`/room/${state.roomId}`);
  }

  if (!state || !state.roomId) return <Navigate to="/" />;

  return (
    <Container
      maxWidth="container.sm"
      display="flex"
      minHeight="100vh"
      flexDir="column"
      justifyContent="center"
    >
      <Heading>Boas vindas!</Heading>
      <Text>
        Para entrar na sala você precisa se identificar.
      </Text>
      <form onSubmit={joinRoom}>
        <Input
          placeholder="Digite o seu nome"
          marginTop={4}
          marginBottom={4}
          onChange={({ target: { value } }) => setInputNameIsFilled(!!value)}
          ref={usernameInputRef}
        />
        <Button
          colorScheme="blue"
          marginLeft="auto"
          display="block"
          type="submit"
          disabled={!inputNameIsFilled}
        >
          Entrar
        </Button>
      </form>
    </Container>
  );
}
