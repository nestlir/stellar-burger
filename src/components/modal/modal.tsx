import { FC, memo, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { TModalProps } from './type';
import { ModalUI } from '@ui';

// Корневой элемент для размещения модального окна в DOM
const modalRoot = document.getElementById('modals');

/**
 * Компонент модального окна.
 * Открывает модальное окно и управляет его закрытием, включая закрытие по нажатию клавиши Escape.
 */
export const Modal: FC<TModalProps> = memo(({ title, onClose, children }) => {
  /**
   * useEffect для обработки нажатия клавиши Escape.
   * При нажатии клавиши Escape модальное окно закрывается.
   */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      e.key === 'Escape' && handleClose();
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  /**
   * Функция для обработки закрытия модального окна.
   * Закрывает модальное окно и устанавливает флаг в localStorage, что окно было закрыто.
   */
  const handleClose = () => {
    onClose();
    localStorage.setItem('orderModalClosed', 'true'); // Устанавливаем флаг, что модальное окно было закрыто
  };

  return ReactDOM.createPortal(
    <ModalUI title={title} onClose={handleClose}>
      {children}
    </ModalUI>,
    modalRoot as HTMLDivElement
  );
});
