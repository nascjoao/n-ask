import React, { useContext, useEffect, useRef } from 'react';
import useValidateRoom from './useValidateRoom';
import supabase from '../supabaseClient';
import useModal from './useModal';
import { userContext } from '../contexts/User';

export default function useJoinRoom(roomId) {
  const roomIsValid = useValidateRoom(roomId);
  const usernameInputRef = useRef();
  const userId = localStorage.getItem('user');
  const { user, setUser } = useContext(userContext);
  const {
    Modal,
    onClose: setUserIsNotRequired,
    onOpen: setUserIsRequired,
    isOpen: userIsRequired,
  } = useModal();

  async function joinEvent(event) {
    event.preventDefault();
    const { data: [{ id }] } = await supabase.from('users').insert({
      name: usernameInputRef.current.value,
      roomId,
    });
    localStorage.setItem('user', id);
    setUser({
      id,
      name: usernameInputRef.current.value,
    });
    setUserIsNotRequired();
  }

  useEffect(() => {
    if (roomIsValid && !user) {
      (async () => {
        if (userId) {
          const { data } = await supabase.from('users').select().eq('id', userId).eq('roomId', roomId);
          if (data && data.length > 0) {
            setUser({ id: data[0].id, name: data[0].name });
          }
        } else {
          setUserIsRequired();
        }
      })();
    }
  }, [roomIsValid, user]);

  function FormToJoin() {
    return (
      <Modal>
        <form onSubmit={joinEvent}>
          <h1>Boas vindas!</h1>
          <p>Como gostaria de se identificar?</p>
          <input type="text" ref={usernameInputRef} placeholder="Digite seu nome" />
        </form>
      </Modal>
    );
  }

  return { user, userIsRequired, FormToJoin };
}
