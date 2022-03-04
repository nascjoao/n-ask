import React from 'react';
import imgNewEvent from '../assets/images/new-event.png';
import imgJoinEvent from '../assets/images/join-event.png';

import styles from '../styles/pages/Home.module.scss';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.cardSection}>
        <img src={imgNewEvent} alt="Pessoas criando algo" />
        <button type="button">Criar evento</button>
      </section>
      <section className={styles.cardSection}>
        <img src={imgJoinEvent} alt="Pessoas apresentando algo" />
        <button type="button">Entrar em evento</button>
      </section>
    </div>
  );
}
