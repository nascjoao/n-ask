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
  Textarea,
  Badge,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon } from '@chakra-ui/icons';
import useValidateRoom from '../hooks/useValidateRoom';
import useJoinRoom from '../hooks/useJoinRoom';
import useQuestions from '../hooks/useQuestions';
import Loading from '../components/Loading';
import supabase from '../supabaseClient';
import Question from '../components/Question';

const MotionButton = motion(Button);

export default function Room() {
  const { id } = useParams();
  const roomIsValid = useValidateRoom(id);
  const { questions, sendQuestion, questionInputRef } = useQuestions(id);
  const { user } = useJoinRoom(id);
  const [userIsOwner, setUserIsOwner] = useState();
  const cancelTerminationRef = useRef();
  const navigate = useNavigate();
  const [remainingCharacters, setRemainingCharacters] = useState(508);
  const [invalidQuestion, setInvalidQuestion] = useState(false);
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

  function adjustTextareaHeight({ target }) {
    target.setAttribute('style', 'height: auto');
    target.setAttribute('style', `height: ${target.scrollHeight}px`);
    setRemainingCharacters(508 - target.value.length);
    setInvalidQuestion(false);
  }

  function submitQuestion(event) {
    event.preventDefault();
    if (remainingCharacters >= 0) {
      sendQuestion(event);
      questionInputRef.current.value = '';
      questionInputRef.current.setAttribute('style', 'height: auto');
      setRemainingCharacters(508);
    } else setInvalidQuestion(true);
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
        <form onSubmit={submitQuestion}>
          <Flex justifyContent="space-between">
            <Text fontWeight="bold">{`Faça uma pergunta${`, ${user && user.name}`}`}</Text>
            <Badge
              margin={2}
              marginLeft={0}
              marginRight={0}
              colorScheme={remainingCharacters < 0 ? 'red' : 'gray'}
            >
              {`Caracteres restantes: ${remainingCharacters}`}
            </Badge>
          </Flex>
          <Textarea
            placeholder="Poderia me dizer..."
            ref={questionInputRef}
            onChange={adjustTextareaHeight}
            overflowY="hidden"
            isInvalid={invalidQuestion}
            marginBottom={4}
          />
          <AnimatePresence>
            { remainingCharacters !== 508 && (
              <MotionButton
                type="submit"
                marginBottom={4}
                marginLeft="auto"
                display="block"
                colorScheme="blue"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
              >
                Enviar
              </MotionButton>
            )}
          </AnimatePresence>
        </form>
      ) }
      { !questions.length ? (
        <h1>Nenhuma questão enviada</h1>
      ) : questions.map((question) => (
        <Question layout key={question.id} data={question} />
      )) }
    </Container>
  );
}
