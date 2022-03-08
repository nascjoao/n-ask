import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useValidateRoom from './useValidateRoom';
import supabase from '../supabaseClient';
import { userContext } from '../contexts/User';

export default function useQuestions(roomId) {
  const roomIsValid = useValidateRoom(roomId);
  const [questions, setQuestions] = useState([]);
  const questionInputRef = useRef();
  const { user } = useContext(userContext);

  async function sendQuestion(event) {
    event.preventDefault();
    await supabase.from('questions').insert({
      userId: localStorage.getItem('user'),
      roomId,
      content: questionInputRef.current.value,
    });
  }

  useEffect(() => {
    if (roomIsValid && (user && user.id)) {
      (async () => {
        const { data: dataQuestions } = await supabase.from('questions').select().eq('roomId', roomId);
        setQuestions(dataQuestions);
      })();

      supabase
        .from('questions')
        .on('*', (payload) => {
          if (payload.eventType === 'INSERT' && (payload.new.roomId === roomId)) {
            setQuestions((currentQuestions) => [...currentQuestions, payload.new]);
          } else {
            setQuestions((currentQuestions) => {
              const remainingQuestions = currentQuestions.filter(
                (question) => question.id !== payload.old.id,
              );
              return remainingQuestions;
            });
          }
        })
        .subscribe();
    }
  }, [roomIsValid, user]);

  return { questions, sendQuestion, questionInputRef };
}
