import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function SingleEvent() {
  const { id } = useParams();
  const [username, setUsername] = useState();
  const [askForUsername, setAskForUsername] = useState(false);
  const [getUserFromLocalStorage, setGetUserFromLocalStorage] = useState(true);
  const usernameInputRef = useRef();

  useEffect(() => {
    if (!username && !getUserFromLocalStorage) {
      setAskForUsername(true);
    }
  }, [username]);

  useEffect(() => {
    (async () => {
      const userId = localStorage.getItem('user');
      const { data } = await supabase.from('users').select().eq('id', userId).eq('roomId', id);
      if (data) {
        setUsername(data[0].name);
      }
      setGetUserFromLocalStorage(false);
    })();
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
    </>
  );
}
