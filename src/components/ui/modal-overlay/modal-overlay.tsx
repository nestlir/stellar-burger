import { FC } from 'react';
import styles from './modal-overlay.module.css';

interface ModalOverlayUIProps {
  onClick: () => void;
}

export const ModalOverlayUI: FC<ModalOverlayUIProps> = ({ onClick }) => (
  <div
    className={styles.overlay}
    onClick={onClick}
    data-test-id='modal-overlay'
  />
);
