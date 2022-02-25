import React from 'react';
import { useParams } from 'react-router-dom';
import useValidateRoom from '../hooks/useValidateRoom';
import useJoinRoom from '../hooks/useJoinRoom';
import useQuestions from '../hooks/useQuestions';
import Loading from '../components/Loading';
import styles from '../styles/pages/Room.module.scss';

export default function Room() {
  const { id } = useParams();
  const roomIsValid = useValidateRoom(id);
  const { username, userIsRequired, FormToJoin } = useJoinRoom(id);
  const { questions, sendQuestion, questionInputRef } = useQuestions(id);

  if (!roomIsValid) return <Loading />;

  return (
    <div className={styles.container}>
      <div>
        <span>Sala: </span>
        <span>{id}</span>
      </div>
      { userIsRequired && (
        <FormToJoin />
      ) }
      <form onSubmit={sendQuestion} className={styles.formQuestion}>
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
    </div>
  );
}
