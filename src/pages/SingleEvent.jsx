import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

export default function SingleEvent() {
  const { id } = useParams();
  const [username, setUsername] = useState();
  const [askForUsername, setAskForUsername] = useState(false);
  const usernameInputRef = useRef();

  useEffect(() => {
    if (!username) {
      setAskForUsername(true);
    }
  }, [username]);

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
