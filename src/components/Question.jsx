import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import supabase from '../supabaseClient';

const MotionBox = motion(Box);

export default function Question({ data: question }) {
  const [questionAuthor, setQuestionAuthor] = useState('');

  useEffect(() => {
    (async () => {
      const { data: [{ name }] } = await supabase.from('users').select().eq('id', question.userId);
      setQuestionAuthor(name);
    })();
  }, []);

  return (
    <MotionBox
      layout
      border="1px solid"
      borderColor="gray.700"
      borderRadius="xl"
      padding={4}
    >
      <Text fontWeight="bold" fontSize="lg">{questionAuthor}</Text>
      <Text>{question.content}</Text>
    </MotionBox>
  );
}
