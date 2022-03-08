import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  IconButton,
  Flex,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CheckIcon, DeleteIcon } from '@chakra-ui/icons';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';
import { userContext } from '../contexts/User';

const MotionBox = motion(Box);

export default function Question({ data: question }) {
  const [questionAuthor, setQuestionAuthor] = useState('');
  const [roomOwner, setRoomOwner] = useState('');
  const { user } = useContext(userContext);
  const { id: roomId } = useParams();
  const {
    isOpen: deleteQuestionIsOpen,
    onOpen: deleteQuestionOnOpen,
    onClose: deleteQuestionOnClose,
  } = useDisclosure();
  const cancelDeleteQuestionRef = useRef();

  useEffect(() => {
    (async () => {
      const { data: [author] } = await supabase.from('users').select().eq('id', question.userId);
      const { data: [{ owner }] } = await supabase.from('rooms').select().eq('id', roomId);
      setQuestionAuthor(author);
      setRoomOwner(user.id === owner);
    })();
  }, []);

  async function deleteQuestion(id) {
    await supabase.from('questions').delete().match({ id });
  }

  return (
    <MotionBox
      layout
      border="1px solid"
      borderColor="gray.700"
      borderRadius="xl"
      padding={4}
      marginTop={4}
      marginBottom={4}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ delay: 1 }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontWeight="bold" fontSize="lg">{questionAuthor.name}</Text>
        <Flex gap={2}>
          { roomOwner && (
            <IconButton
              icon={<CheckIcon />}
              aria-label="Resolvido"
              colorScheme="green"
              variant="ghost"
              onClick={() => deleteQuestion(question.id)}
            />
          ) }
          { user.id === questionAuthor.id && (
            <>
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Apagar"
                colorScheme="red"
                variant="ghost"
                onClick={deleteQuestionOnOpen}
              />
              <AlertDialog
                isOpen={deleteQuestionIsOpen}
                onClose={deleteQuestionOnClose}
                leastDestructiveRef={cancelDeleteQuestionRef}
              >
                <AlertDialogOverlay />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    Tem certeza?
                  </AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody>
                    Após apagar sua pergunta, não será possível recuperá-la.
                  </AlertDialogBody>
                  <AlertDialogFooter gap={2}>
                    <Button
                      variant="outline"
                      onClick={() => deleteQuestion(question.id)}
                    >
                      Sim, apagar
                    </Button>
                    <Button
                      colorScheme="blue"
                      ref={cancelDeleteQuestionRef}
                      onClick={deleteQuestionOnClose}
                    >
                      Cancelar
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) }
        </Flex>
      </Flex>
      <Text marginTop={4}>{question.content}</Text>
    </MotionBox>
  );
}
