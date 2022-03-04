import React, { useEffect, useRef, useState } from 'react';
import useValidateRoom from './useValidateRoom';
import supabase from '../supabaseClient';
import useModal from './useModal';

export default function useJoinRoom(roomId) {
  const roomIsValid = useValidateRoom(roomId);
  const [username, setUsername] = useState();
  const usernameInputRef = useRef();
  const userId = localStorage.getItem('user');
  const {
    Modal,
    onClose: setUserIsNotRequired,
    onOpen: setUserIsRequired,
    isOpen: userIsRequired,
  } = useModal();

  async function joinEvent(event) {
    event.preventDefault();
    const { data } = await supabase.from('users').insert({
      name: usernameInputRef.current.value,
      roomId,
    });
    localStorage.setItem('user', data[0].id);
    setUsername(usernameInputRef.current.value);
    setUserIsNotRequired();
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
          setUserIsRequired();
        }
      })();
    }
  }, [roomIsValid, username]);

  function FormToJoin() {
    return (
      <Modal>
        <form onSubmit={joinEvent}>
          <h1>Boas vindas!</h1>
          <p>Como gostaria de se identificar?</p>
          <input type="text" ref={usernameInputRef} />
        </form>
      </Modal>
    );
  }

  return { username, userIsRequired, FormToJoin };
}
