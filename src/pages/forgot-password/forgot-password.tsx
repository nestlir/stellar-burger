import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';

/**
 * Компонент для страницы восстановления пароля.
 * Включает логику обработки формы и отправки запроса на сброс пароля.
 */
export const ForgotPassword: FC = () => {
  const navigate = useNavigate();

  // Локальное состояние для хранения значения email и возможной ошибки
  const [email, setEmail] = useState('');
  const [error, setError] = useState<Error | null>(null);

  /**
   * Обработка отправки формы восстановления пароля.
   * Отправляет запрос на сервер для сброса пароля.
   *
   * @param {SyntheticEvent} e - Событие отправки формы.
   */
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null);

    forgotPasswordApi({ email })
      .then(() => {
        // Сохраняем флаг сброса пароля в localStorage
        localStorage.setItem('resetPassword', 'true');

        // Перенаправляем пользователя на страницу сброса пароля
        navigate('/reset-password', { replace: true });
      })
      .catch((err) => setError(err)); // Устанавливаем ошибку, если запрос завершился неудачно
  };

  return (
    <ForgotPasswordUI
      errorText={error?.message} // Текст ошибки для отображения в UI
      email={email} // Текущее значение email
      setEmail={setEmail} // Функция для обновления состояния email
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
