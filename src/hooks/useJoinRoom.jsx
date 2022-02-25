import React, { useEffect, useRef, useState } from 'react';
import useValidateRoom from './useValidateRoom';
import supabase from '../supabaseClient';

export default function useJoinRoom(roomId) {
  const roomIsValid = useValidateRoom(roomId);
  const [username, setUsername] = useState();
  const [userIsRequired, setUserIsRequired] = useState(false);
  const [getUserFromLocalStorage, setGetUserFromLocalStorage] = useState(true);
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
    if (roomIsValid) {
      (async () => {
        if (userId) {
          const { data } = await supabase.from('users').select().eq('id', userId).eq('roomId', roomId);

          if (data && data.length > 0) {
            setUsername(data[0].name);
          }
        }
        setGetUserFromLocalStorage(false);
      })();
    }
  }, [roomIsValid]);

  useEffect(() => {
    if (!username && !getUserFromLocalStorage && roomIsValid) {
      setUserIsRequired(true);
    }
  }, [username, getUserFromLocalStorage, roomIsValid]);

  function FormToJoin() {
    return (
      <form onSubmit={joinEvent}>
        <h1>Boas vindas!</h1>
        <p>Como gostaria de se identificar?</p>
        <input type="text" ref={usernameInputRef} />
      </form>
    );
  }

  return { username, userIsRequired, FormToJoin };
}
