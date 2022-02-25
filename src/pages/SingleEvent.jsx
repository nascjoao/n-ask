import React from 'react';
import { useParams } from 'react-router-dom';
import useValidateRoom from '../hooks/useValidateRoom';
import useJoinRoom from '../hooks/useJoinRoom';
import useQuestions from '../hooks/useQuestions';

export default function SingleEvent() {
  const { id } = useParams();
  const roomIsValid = useValidateRoom(id);
  const { username, userIsRequired, FormToJoin } = useJoinRoom(id);
  const { questions, sendQuestion, questionInputRef } = useQuestions(id);

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
        <textarea placeholder="Poderia me dizer..." ref={questionInputRef} />
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
