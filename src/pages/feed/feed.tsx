import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedSelectors, fetchFeed } from '../../services/slices/feedSlice';

/**
 * Компонент для отображения ленты заказов.
 * Включает логику загрузки данных и отображение интерфейса.
 */
export const Feed: FC = () => {
  // Получаем список заказов из состояния Redux с помощью селектора
  const orders: TOrder[] = useSelector(feedSelectors.ordersSelector);

  const dispatch = useDispatch();

  /**
   * useEffect для загрузки данных ленты заказов при монтировании компонента.
   * Вызывает асинхронное действие fetchFeed для получения данных.
   */
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Если заказы еще не загружены, отображаем прелоадер
  if (!orders.length) return <Preloader />;

  // Если заказы загружены, отображаем их в интерфейсе
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
