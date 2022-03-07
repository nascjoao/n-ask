import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import useValidateRoom from '../hooks/useValidateRoom';
import useJoinRoom from '../hooks/useJoinRoom';
import useQuestions from '../hooks/useQuestions';
import Loading from '../components/Loading';
import supabase from '../supabaseClient';

export default function Room() {
  const { id } = useParams();
  const roomIsValid = useValidateRoom(id);
  const { questions, sendQuestion, questionInputRef } = useQuestions(id);
  const { user } = useJoinRoom(id);
  const [userIsOwner, setUserIsOwner] = useState();
  const cancelTerminationRef = useRef();
  const navigate = useNavigate();
  const {
    isOpen: terminateIsOpen,
    onOpen: terminateOnOpen,
    onClose: terminateOnClose,
  } = useDisclosure();

  useEffect(() => {
    if (user) {
      (async () => {
        const { data: [{ owner }] } = await supabase.from('rooms').select().eq('id', id);
        setUserIsOwner(owner === user.id);
      })();
    }
    setUserIsOwner(false);
  }, [user]);

  useEffect(() => {
    supabase.from('*').on('DELETE', ({ old }) => {
      if (old.id === id) {
        navigate('/');
      }
    }).subscribe();
  }, [roomIsValid]);

  async function terminateRoom() {
    navigate('/');
    await supabase.from('questions').delete().match({ roomId: id });
    await supabase.from('users').delete().match({ roomId: id });
    await supabase.from('rooms').delete().match({ id });
  }

  if (!roomIsValid) return <Loading />;

  return (
    <Container
      maxWidth="container.md"
      margin="0 auto"
      marginTop={20}
    >
      <Flex as="header" justifyContent="space-between" alignItems="center">
        <span>{`Sala: ${id}`}</span>
        { userIsOwner && (
          <Button leftIcon={<CloseIcon />} variant="outline" onClick={terminateOnOpen}>
            Finalizar sala
          </Button>
        ) }
        <AlertDialog
          isOpen={terminateIsOpen}
          onClose={terminateOnClose}
          leastDestructiveRef={cancelTerminationRef}
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              Tem certeza?
            </AlertDialogHeader>
            <AlertDialogBody>
              Todas as perguntas serão perdidas e a sala ficará indisponível.
              <Text fontWeight="bold" marginTop={4}>Essa ação não poderá ser desfeita.</Text>
            </AlertDialogBody>
            <AlertDialogFooter gap={4}>
              <Button colorScheme="blue" variant="outline" onClick={terminateRoom}>
                Sim, finalizar
              </Button>
              <Button colorScheme="blue" onClick={terminateOnClose} ref={cancelTerminationRef}>
                Ainda não
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Flex>
      { !userIsOwner && (
        <form onSubmit={sendQuestion}>
          <h2>Faça sua pergunta</h2>
          { user && <strong>{user.name}</strong> }
          <textarea placeholder="Poderia me dizer..." ref={questionInputRef} />
          <button type="submit">Enviar</button>
        </form>
      ) }
      { !questions.length ? (
        <h1>Nenhuma questão enviada</h1>
      ) : questions.map((question) => (
        <div key={question.id}>
          {question.content}
        </div>
      )) }
    </Container>
  );
}
