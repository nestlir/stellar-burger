import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { fetchRegisterUser } from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент для регистрации нового пользователя.
 * Включает логику обработки формы регистрации и отправки данных на сервер.
 */
export const Register: FC = () => {
  // Состояния для хранения имени пользователя, email и пароля
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Обработка отправки формы регистрации.
   *
   * @param {SyntheticEvent} e - Событие отправки формы.
   */
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Отправляем данные для регистрации пользователя
    dispatch(fetchRegisterUser({ name: userName, email, password }));

    // Перенаправляем пользователя на главную страницу после регистрации
    navigate('/');
  };

  return (
    <RegisterUI
      errorText='' // Текст ошибки для отображения в UI
      email={email} // Текущее значение email
      userName={userName} // Текущее значение имени пользователя
      password={password} // Текущее значение пароля
      setEmail={setEmail} // Функция для обновления состояния email
      setPassword={setPassword} // Функция для обновления состояния пароля
      setUserName={setUserName} // Функция для обновления состояния имени пользователя
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};
