import { Preloader } from '@ui';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userSelectors } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

/**
 * Компонент защищенного маршрута.
 * Управляет доступом к маршрутам в зависимости от статуса авторизации пользователя.
 *
 * @param {ProtectedRouteProps} props - Пропсы, содержащие флаг onlyUnAuth и дочерний элемент для отображения.
 */
export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  // Получаем информацию о пользователе и статус проверки авторизации из Redux
  const user = useSelector(userSelectors.userSelector);
  const isAuthChecked = useSelector(userSelectors.isAuthCheckedSelector);

  // Если статус авторизации еще не проверен, отображаем прелоадер
  if (!isAuthChecked) return <Preloader />;

  // Если маршрут защищен (onlyUnAuth === false) и пользователь не авторизован, перенаправляем на страницу логина
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если маршрут предназначен только для неавторизованных пользователей, но пользователь авторизован, перенаправляем на предыдущую страницу или на главную
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  // Если все условия выполнены, отображаем дочерний элемент
  return children;
};
