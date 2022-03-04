import React from 'react';
import { Link } from 'react-router-dom';
import imgNewEvent from '../assets/images/new-event.png';
import imgJoinEvent from '../assets/images/join-event.png';

export default function Home() {
  return (
    <div>
      <Link to="/room/new">
        <img src={imgNewEvent} alt="Pessoas criando algo" />
        <span>Criar evento</span>
      </Link>
      <section>
        <img src={imgJoinEvent} alt="Pessoas criando algo" />
        <button type="button">Entrar em evento</button>
      </section>
    </div>
  );
}
