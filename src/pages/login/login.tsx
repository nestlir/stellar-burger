import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { fetchLoginUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент для страницы логина.
 * Включает логику обработки формы входа и отправки данных на сервер.
 */
export const Login: FC = () => {
  // Локальное состояние для хранения значений полей email и пароля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Обработка отправки формы логина.
   * Отправляет данные на сервер для входа пользователя.
   *
   * @param {SyntheticEvent} e - Событие отправки формы.
   */
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Отправляем данные для входа пользователя
    dispatch(fetchLoginUser({ email, password }));

    // Перенаправляем пользователя на главную страницу после успешного входа
    navigate('/');
  };

  return (
    <LoginUI
      errorText='' // Текст ошибки для отображения в UI (пока пусто)
      email={email} // Текущее значение email
      setEmail={setEmail} // Функция для обновления состояния email
      password={password} // Текущее значение пароля
      setPassword={setPassword} // Функция для обновления состояния пароля
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
