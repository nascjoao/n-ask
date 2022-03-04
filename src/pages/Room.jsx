import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useValidateRoom from '../hooks/useValidateRoom';
import useJoinRoom from '../hooks/useJoinRoom';
import useQuestions from '../hooks/useQuestions';
import Loading from '../components/Loading';
import styles from '../styles/pages/Room.module.scss';
import supabase from '../supabaseClient';

export default function Room() {
  const { id } = useParams();
  const roomIsValid = useValidateRoom(id);
  const { user, userIsRequired, FormToJoin } = useJoinRoom(id);
  const { questions, sendQuestion, questionInputRef } = useQuestions(id);
  const [userIsOwner, setUserIsOwner] = useState();

  useEffect(() => {
    if (user && userIsOwner === undefined) {
      (async () => {
        const { data: [{ owner }] } = await supabase.from('rooms').select().eq('id', id);
        setUserIsOwner(owner === user.id);
      })();
    }
  }, [user]);

  if (!roomIsValid || userIsOwner === undefined) return <Loading />;

  return (
    <div className={styles.container}>
      <div>
        <span>Sala: </span>
        <span>{id}</span>
      </div>
      { userIsRequired && (
        <FormToJoin />
      ) }
      { !userIsOwner && (
        <form onSubmit={sendQuestion} className={styles.formQuestion}>
          <h2>Faça sua pergunta</h2>
          { user && <strong>{user.name}</strong> }
          <textarea placeholder="Poderia me dizer..." ref={questionInputRef} />
          <button type="submit">Enviar</button>
        </form>
      ) }
      { questions.map((question) => (
        <div key={question.id}>
          {question.content}
        </div>
      )) }
    </div>
  );
}
