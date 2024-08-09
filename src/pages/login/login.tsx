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
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * Обработка отправки формы логина.
   * Отправляет данные на сервер для входа пользователя.
   *
   * @param {SyntheticEvent} e - Событие отправки формы.
   */
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null); // Сбрасываем предыдущие ошибки

    // Отправляем данные для входа пользователя
    const resultAction = await dispatch(fetchLoginUser({ email, password }));

    // Проверяем успешность запроса
    if (fetchLoginUser.fulfilled.match(resultAction)) {
      navigate('/'); // Перенаправляем пользователя на главную страницу после успешного входа
    } else {
      // Обработка ошибки авторизации
      setError('Ошибка при авторизации. Проверьте введенные данные.');
    }
  };

  return (
    <LoginUI
      errorText='' // Текст ошибки для отображения в UI
      email={email} // Текущее значение email
      setEmail={setEmail} // Функция для обновления состояния email
      password={password} // Текущее значение пароля
      setPassword={setPassword} // Функция для обновления состояния пароля
      handleSubmit={handleSubmit} // Обработчик отправки формы
    />
  );
};

export default Login;
