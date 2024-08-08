import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  // Состояние для хранения пароля, токена и ошибки
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  // Функция для проверки флага сброса пароля в localStorage
  const isResetPasswordAllowed = () =>
    localStorage.getItem('resetPassword') !== null;

  // Обработка отправки формы
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

  // Проверяем, можно ли сбросить пароль, и перенаправляем на другую страницу, если нет
  useEffect(() => {
    if (!isResetPasswordAllowed()) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
