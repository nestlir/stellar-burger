import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders, orderSelectors } from '../../services/slices/orderSlice';

/**
 * Компонент для отображения заказов в профиле пользователя.
 * Подгружает список заказов при монтировании и отображает их с помощью UI-компонента.
 */
export const ProfileOrders: FC = () => {
  // Получаем список заказов из состояния Redux с помощью селектора
  const orders: TOrder[] = useSelector(orderSelectors.ordersSelector);

  const dispatch = useDispatch();

  /**
   * useEffect для подгрузки списка заказов при монтировании компонента.
   * Вызывает асинхронное действие fetchOrders для получения данных.
   */
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
