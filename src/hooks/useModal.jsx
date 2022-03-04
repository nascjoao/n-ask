import React, { useEffect, useState } from 'react';

export default function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.onclick = ({ target }) => {
      if (target.classList.contains('overlay')) setIsOpen(false);
    };
  }, []);

  function Modal({ heading, subheading, children }) {
    return (
      <div>
        <div>
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
