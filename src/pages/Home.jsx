import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import imgNewEvent from '../assets/images/new-event.png';
import imgJoinEvent from '../assets/images/join-event.png';
import useModal from '../hooks/useModal';

import styles from '../styles/pages/Home.module.scss';

export default function Home() {
  const { Modal, isOpen, onOpen } = useModal();
  const inputRef = useRef();
  const navigate = useNavigate();

  function joinRoom(event) {
    event.preventDefault();
    navigate(`/room/${inputRef.current.value}`);
  }

  return (
    <>
      <div className={styles.home}>
        <section className={styles.cardSection}>
          <img src={imgNewEvent} alt="Pessoas criando algo" />
          <button type="button">Criar sala</button>
        </section>
        <section className={styles.cardSection}>
          <img src={imgJoinEvent} alt="Pessoas apresentando algo" />
          <button type="button" onClick={onOpen}>Entrar em sala</button>
        </section>
      </div>
      { isOpen && (
        <Modal heading="Entrar" subheading="Insira o ID da sala">
          <form onSubmit={joinRoom} className={styles.formToJoinRoom}>
            <input
              type="text"
              placeholder="Ex.: bc908c08-dea8-485b-aa0c-07a784d3dcb6"
              ref={inputRef}
            />
            <button type="submit">Entrar</button>
          </form>
        </Modal>
      ) }
    </>
  );
}
