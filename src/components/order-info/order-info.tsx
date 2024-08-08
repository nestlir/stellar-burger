import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  orderSelectors
} from '../../services/slices/orderSlice';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

/**
 * Компонент для отображения информации о заказе.
 * Загружает данные о заказе по его номеру и отображает детальную информацию с ингредиентами.
 */
export const OrderInfo: FC = () => {
  // Получаем данные о заказе и список ингредиентов из глобального состояния Redux
  const orderData = useSelector(orderSelectors.orderSelector);
  const ingredients: TIngredient[] = useSelector(
    ingredientsSelectors.ingredientsSelector
  );

  // Получаем номер заказа из параметров URL
  const id = useParams().number;

  const dispatch = useDispatch();

  // useEffect для загрузки данных о заказе при монтировании компонента
  useEffect(() => {
    dispatch(fetchOrderByNumber(Number(id)));
  }, [dispatch, id]);

  /**
   * Мемоизированная функция для вычисления информации о заказе.
   * Включает обработку списка ингредиентов, подсчет общей стоимости и форматирование даты заказа.
   */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Формируем информацию об ингредиентах с учетом их количества
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else acc[item].count++;

        return acc;
      },
      {}
    );

    // Подсчитываем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Если данные заказа еще загружаются, отображаем прелоадер
  if (!orderInfo) return <Preloader />;

  // Отображаем UI компонента с информацией о заказе
  return <OrderInfoUI orderInfo={orderInfo} />;
};
