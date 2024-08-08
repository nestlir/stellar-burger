import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { feedSelectors } from '../../services/slices/feedSlice';

/**
 * Функция для получения номеров заказов по их статусу.
 *
 * @param {TOrder[]} orders - Список заказов.
 * @param {string} status - Статус заказа, который нужно фильтровать (например, 'done' или 'pending').
 * @returns {number[]} - Массив номеров заказов, отфильтрованных по статусу, ограниченный 20 элементами.
 */
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

/**
 * Компонент для отображения информации о ленте заказов.
 * Подсчитывает количество выполненных и ожидающих заказов и отображает общую информацию о ленте.
 */
export const FeedInfo: FC = () => {
  // Получаем список заказов и информацию о ленте из глобального состояния Redux
  const orders: TOrder[] = useSelector(feedSelectors.ordersSelector);
  const feed = {
    total: useSelector(feedSelectors.totalSelector),
    totalToday: useSelector(feedSelectors.totalTodaySelector)
  };

  // Получаем номера выполненных и ожидающих заказов
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders} // Номера выполненных заказов
      pendingOrders={pendingOrders} // Номера ожидающих заказов
      feed={feed} // Общая информация о ленте заказов
    />
  );
};
