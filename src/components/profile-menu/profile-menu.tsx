import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { fetchLogout } from '../../services/slices/userSlice';

/**
 * Компонент меню профиля пользователя.
 * Обеспечивает функциональность навигации и выхода из системы.
 */
export const ProfileMenu: FC = () => {
  // Получаем текущий путь из маршрута
  const { pathname } = useLocation();

  // Хук для навигации между страницами
  const navigate = useNavigate();

  // Хук для диспатча действий в Redux
  const dispatch = useDispatch();

  /**
   * Обработчик выхода из системы.
   * Выполняет выход и перенаправляет пользователя на главную страницу.
   */
  const handleLogout = () => {
    dispatch(fetchLogout());
    navigate('/');
  };

  // Возвращаем компонент UI для отображения меню профиля
  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
