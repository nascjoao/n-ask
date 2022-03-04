import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as generateUUID } from 'uuid';
import imgNewEvent from '../assets/images/new-event.png';
import imgJoinEvent from '../assets/images/join-event.png';
import useModal from '../hooks/useModal';
import supabase from '../supabaseClient';

import { userContext } from '../contexts/User';

export default function Home() {
  const { Modal: JoinModal, isOpen: joinIsOpen, onOpen: joinOnOpen } = useModal();
  const { Modal: CreateModal, isOpen: createIsOpen, onOpen: createOnOpen } = useModal();
  const roomIdInputRef = useRef();
  const nameInputRef = useRef();
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  async function createRoom(event) {
    event.preventDefault();
    const userId = generateUUID();
    const { data: [{ id: roomId }] } = await supabase.from('rooms').insert({
      owner: userId,
    });
    await supabase.from('users').insert({
      id: userId,
      name: nameInputRef.current.value,
      roomId,
    });
    setUser({
      id: userId,
      name: nameInputRef.current.value,
    });
    navigate(`/room/${roomId}`);
    localStorage.setItem('user', userId);
  }

  function joinRoom(event) {
    event.preventDefault();
    navigate(`/room/${roomIdInputRef.current.value}`);
  }

  return (
    <>
      <div>
        <section>
          <img src={imgNewEvent} alt="Pessoas criando algo" />
          <button type="button" onClick={createOnOpen}>Criar sala</button>
        </section>
        <section>
          <img src={imgJoinEvent} alt="Pessoas apresentando algo" />
          <button type="button" onClick={joinOnOpen}>Entrar em sala</button>
        </section>
      </div>
      { joinIsOpen && (
        <JoinModal heading="Entrar" subheading="Insira o ID da sala">
          <form onSubmit={joinRoom}>
            <input
              type="text"
              placeholder="Ex.: bc908c08-dea8-485b-aa0c-07a784d3dcb6"
              ref={roomIdInputRef}
            />
            <button type="submit">Entrar</button>
          </form>
        </JoinModal>
      ) }
      { createIsOpen && (
        <CreateModal heading="Criar sala" subheading="Como gostaria de se identificar?">
          <form onSubmit={createRoom}>
            <input type="text" ref={nameInputRef} placeholder="Digite seu nome" />
          </form>
        </CreateModal>
      ) }
    </>
  );
}
