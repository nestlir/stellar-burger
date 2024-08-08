import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6;

/**
 * Компонент для отображения карточки заказа.
 * Подсчитывает количество ингредиентов, общую стоимость заказа и форматирует данные для отображения.
 *
 * @param {OrderCardProps} props - Пропсы, содержащие информацию о заказе.
 */
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  // Получаем список ингредиентов из глобального состояния Redux
  const ingredients: TIngredient[] = useSelector(
    ingredientsSelectors.ingredientsSelector
  );

  /**
   * Мемоизированная функция для вычисления данных заказа.
   * Включает подсчет общей стоимости, фильтрацию и ограничение количества отображаемых ингредиентов.
   */
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    // Сбор информации об ингредиентах, используемых в заказе
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Подсчет общей стоимости заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ограничиваем количество отображаемых ингредиентов
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Подсчет оставшихся ингредиентов, которые не отображаются
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Форматируем дату заказа
    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredients]);

  // Если данные заказа не были рассчитаны, возвращаем null
  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo} // Информация о заказе для отображения в UI
      maxIngredients={maxIngredients} // Максимальное количество отображаемых ингредиентов
      locationState={{ background: location }} // Состояние маршрута для работы с модальными окнами
    />
  );
});
