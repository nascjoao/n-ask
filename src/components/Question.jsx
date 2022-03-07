import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Flex,
  Text,
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
            <IconButton icon={<DeleteIcon />} aria-label="Apagar" colorScheme="red" variant="ghost" />
          ) }
        </Flex>
      </Flex>
      <Text marginTop={4}>{question.content}</Text>
    </MotionBox>
  );
}
