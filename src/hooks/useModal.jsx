import React, { useEffect, useState } from 'react';

import styles from '../styles/hooks/useModal.module.scss';

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.onclick = ({ target }) => {
      if (target.classList.contains('overlay')) setIsOpen(false);
    };
  }, []);

  function Modal({ heading, subheading, children }) {
    return (
      <div className={`${styles.overlay} overlay`}>
        <div className={styles.modal}>
          { heading && <h1>{heading}</h1> }
          { subheading && <p>{subheading}</p> }
          { children }
        </div>
      </div>
    );
  }

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    Modal,
  };
}
