import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUpdateUser,
  userSelectors
} from '../../services/slices/userSlice';

/**
 * Компонент для отображения и редактирования профиля пользователя.
 * Включает логику изменения данных профиля и взаимодействия с формой.
 */
export const Profile: FC = () => {
  // Получаем текущие данные пользователя из состояния Redux с помощью селектора
  const user = useSelector(userSelectors.userSelector);

  // Локальное состояние для значений формы
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const dispatch = useDispatch();

  /**
   * useEffect для обновления локального состояния формы при изменении данных пользователя.
   * Если данные пользователя изменяются, обновляем значения в форме.
   */
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  // Проверка, изменились ли данные в форме по сравнению с текущими данными пользователя
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  /**
   * Обработка отправки формы.
   * Отправляет обновленные данные пользователя.
   *
   * @param {SyntheticEvent} e - Событие отправки формы.
   */
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(fetchUpdateUser(formValue));
  };

  /**
   * Обработка отмены изменений в форме.
   * Возвращает значения в форме к текущим данным пользователя.
   *
   * @param {SyntheticEvent} e - Событие нажатия кнопки отмены.
   */
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  /**
   * Обработка изменения значений в полях формы.
   * Обновляет локальное состояние формы.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Событие изменения значения в поле ввода.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue} // Текущие значения полей формы
      isFormChanged={isFormChanged} // Флаг, показывающий, изменились ли данные в форме
      handleCancel={handleCancel} // Обработчик отмены изменений в форме
      handleSubmit={handleSubmit} // Обработчик отправки формы
      handleInputChange={handleInputChange} // Обработчик изменения значений в полях формы
    />
  );
};
