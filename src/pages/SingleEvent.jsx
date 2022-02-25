import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import validateRoom from '../hooks/validateRoom';
import supabase from '../supabaseClient';

export default function SingleEvent() {
  const { id } = useParams();
  const roomIsValid = validateRoom(id);
  const [username, setUsername] = useState();
  const [askForUsername, setAskForUsername] = useState(false);
  const [getUserFromLocalStorage, setGetUserFromLocalStorage] = useState(true);
  const [questions, setQuestions] = useState([]);
  const usernameInputRef = useRef();
  const questionTextAreaRef = useRef();

  useEffect(() => {
    if (!username && !getUserFromLocalStorage && roomIsValid) {
      setAskForUsername(true);
    }
  }, [username, getUserFromLocalStorage]);

  useEffect(() => {
    if (roomIsValid) {
      (async () => {
        const userId = localStorage.getItem('user');
        if (userId) {
          const { data: dataUser } = await supabase.from('users').select().eq('id', userId).eq('roomId', id);
          const { data: dataQuestions } = await supabase.from('questions').select();
          setQuestions(dataQuestions);
          if (dataUser && dataUser.length > 0) {
            setUsername(dataUser[0].name);
          }
        }
        setGetUserFromLocalStorage(false);
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

  async function joinEvent(event) {
    event.preventDefault();
    const { data } = await supabase.from('users').insert({
      name: usernameInputRef.current.value,
      roomId: id,
    });
    localStorage.setItem('user', data[0].id);
    setUsername(usernameInputRef.current.value);
    setAskForUsername(false);
  }

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
      { askForUsername && (
        <form onSubmit={joinEvent}>
          <h1>Boas vindas!</h1>
          <p>Como gostaria de se identificar?</p>
          <input type="text" ref={usernameInputRef} />
        </form>
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
