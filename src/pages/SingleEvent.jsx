import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useValidateRoom from '../hooks/useValidateRoom';
import useJoinRoom from '../hooks/useJoinRoom';
import supabase from '../supabaseClient';

export default function SingleEvent() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const questionTextAreaRef = useRef();
  const roomIsValid = useValidateRoom(id);
  const { username, userIsRequired, FormToJoin } = useJoinRoom(id);

  useEffect(() => {
    if (roomIsValid) {
      (async () => {
        const { data: dataQuestions } = await supabase.from('questions').select();
        setQuestions(dataQuestions);
      })();

      supabase
        .from('questions')
        .on('*', (payload) => {
          if (payload.eventType === 'INSERT') {
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
  }, []);

  async function sendQuestion(event) {
    event.preventDefault();
    await supabase.from('questions').insert({
      userId: localStorage.getItem('user'),
      roomId: id,
      content: questionTextAreaRef.current.value,
    });
  }

  if (!roomIsValid) return <h1>Carregando...</h1>;

  return (
    <>
      <div>{id}</div>
      { userIsRequired && (
        <FormToJoin />
      ) }
      <form onSubmit={sendQuestion}>
        <h2>Faça sua pergunta</h2>
        { username && <strong>{username}</strong> }
        <textarea placeholder="Poderia me dizer..." ref={questionTextAreaRef} />
        <button type="submit">Enviar</button>
      </form>
      { questions.map((question) => (
        <div key={question.id}>
          {question.content}
        </div>
      )) }
    </>
  );
}
