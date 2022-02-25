import React, { useEffect, useRef, useState } from 'react';
import useValidateRoom from './useValidateRoom';
import supabase from '../supabaseClient';
import styles from '../styles/hooks/useJoinRoom.module.scss';

export default function useJoinRoom(roomId) {
  const roomIsValid = useValidateRoom(roomId);
  const [username, setUsername] = useState();
  const [userIsRequired, setUserIsRequired] = useState(false);
  const usernameInputRef = useRef();
  const userId = localStorage.getItem('user');

  async function joinEvent(event) {
    event.preventDefault();
    const { data } = await supabase.from('users').insert({
      name: usernameInputRef.current.value,
      roomId,
    });
    localStorage.setItem('user', data[0].id);
    setUsername(usernameInputRef.current.value);
    setUserIsRequired(false);
  }

  useEffect(() => {
    if (roomIsValid && !username) {
      (async () => {
        if (userId) {
          const { data } = await supabase.from('users').select().eq('id', userId).eq('roomId', roomId);
          if (data && data.length > 0) {
            setUsername(data[0].name);
          }
        } else {
          setUserIsRequired(true);
        }
      })();
    }
  }, [roomIsValid, username]);

  function FormToJoin() {
    return (
      <div
        className={styles.form}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
      >
        <form onSubmit={joinEvent}>
          <h1>Boas vindas!</h1>
          <p>Como gostaria de se identificar?</p>
          <input type="text" ref={usernameInputRef} />
        </form>
      </div>
    );
  }

  return { username, userIsRequired, FormToJoin };
}
