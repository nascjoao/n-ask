import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
  useToast,
  useClipboard,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CloseIcon, CopyIcon } from '@chakra-ui/icons';
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
  const { state } = useLocation();
  const {
    isOpen: terminateIsOpen,
    onOpen: terminateOnOpen,
    onClose: terminateOnClose,
  } = useDisclosure();
  const toast = useToast();
  const { onCopy } = useClipboard(id);

  useEffect(() => {
    if (state && state.abandoned) {
      toast({
        title: 'Erro',
        description: 'Não foi possível entrar na sala desejada',
        isClosable: true,
        status: 'error',
        duration: null,
      });
      toast({
        title: 'Atenção',
        description: `Parece que você possui essa sala (${id}). Antes de
        entrar em uma nova, é necessário finalizar essa.`,
        isClosable: true,
        status: 'warning',
        duration: null,
      });
    }
  }, [state]);

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
        navigate('/room/ended', {
          state: {
            abandoned: false,
          },
        });
      }
    }).subscribe();
  }, [roomIsValid]);

  function copyRoomId() {
    onCopy();
    toast({
      title: 'Copiado!',
      description: 'Compartilhe esse ID com as pessoas para receber perguntas',
      status: 'info',
      duration: 9000,
      isClosable: true,
    });
  }

  async function terminateRoom() {
    navigate('/room/ended', {
      state: {
        abandoned: false,
      },
    });
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
    if (remainingCharacters >= 0 && questionInputRef.current.value.trim()) {
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
      <Flex
        as="header"
        justifyContent="space-between"
        alignItems={['start', 'center']}
        marginBottom={8}
        flexDirection={['column', 'row']}
        gap={4}
      >
        <Button
          rightIcon={<CopyIcon />}
          onClick={copyRoomId}
          maxW="100%"
        >
          <Text isTruncated>
            {`Sala: ${id}`}
          </Text>
        </Button>
        { userIsOwner && (
          <Button
            leftIcon={<CloseIcon />}
            variant="outline"
            onClick={terminateOnOpen}
            width="max-content"
          >
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
        <motion.form
          onSubmit={submitQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Flex justifyContent="space-between" flexDirection={['column', 'row']}>
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
            { (remainingCharacters !== 508 && questionInputRef.current.value.trim()) && (
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
        </motion.form>
      ) }
      { !questions.length && userIsOwner ? (
        <>
          <Text fontWeight="bold" fontSize="xl">Nenhuma pergunta</Text>
          <Text>
            Compartilhe o ID da sala com outras pessoas
            para receber perguntas.
          </Text>
        </>
      ) : (
        <AnimatePresence>
          {questions.map((question) => (
            <Question layout key={question.id} data={question} />
          ))}
        </AnimatePresence>
      ) }
    </Container>
  );
}
