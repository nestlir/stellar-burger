import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

/**
 * Компонент для сброса пароля.
 * Включает логику проверки доступа к сбросу пароля, отправки формы и управления состоянием.
 */
export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  // Состояние для хранения пароля, токена и ошибки
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  /**
   * Функция для проверки, разрешено ли сбрасывать пароль.
   * Основана на наличии флага 'resetPassword' в localStorage.
   *
   * @returns {boolean} Возвращает true, если сброс пароля разрешен.
   */
  const isResetPasswordAllowed = () =>
    localStorage.getItem('resetPassword') !== null;

  /**
   * Обработка отправки формы сброса пароля.
   * Отправляет запрос на API для сброса пароля.
   *
   * @param {SyntheticEvent} e - Событие отправки формы.
   */
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(undefined); // Сбрасываем ошибку перед отправкой

    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  /**
   * useEffect, который проверяет, разрешен ли сброс пароля.
   * Если сброс пароля не разрешен, перенаправляет пользователя на страницу восстановления пароля.
   */
  useEffect(() => {
    if (!isResetPasswordAllowed()) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error} // Текст ошибки для отображения в UI
      password={password} // Текущее значение пароля
      token={token} // Текущий токен для сброса пароля
      setPassword={setPassword} // Функция для обновления состояния пароля
      setToken={setToken} // Функция для обновления состояния токена
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
