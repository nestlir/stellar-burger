import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import {
  burgerConstructorActions,
  burgerConstructorSelectors
} from '../../services/slices/burger-constructor-slice';
import {
  fetchOrderBurger,
  orderActions,
  orderSelectors
} from '../../services/slices/orderSlice';
import { fetchUser, userSelectors } from '../../services/slices/userSlice';

/**
 * Компонент для отображения и управления конструктором бургера.
 * Включает функциональность добавления ингредиентов, оформления заказа и отображения данных о заказе.
 */
export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получаем состояние текущего пользователя, булочки, ингредиентов и данных о заказе
  const user = useSelector(userSelectors.userSelector);
  const bun = useSelector(burgerConstructorSelectors.bunSelector);
  const ingredients = useSelector(
    burgerConstructorSelectors.ingredientsSelector
  );
  const orderRequest = useSelector(orderSelectors.isLoadingSelector);
  const orderModalData = useSelector(orderSelectors.orderSelector);

  /**
   * useEffect для получения данных пользователя при монтировании компонента.
   * Если заказ был успешно завершен, очищает состояние конструктора и данные модального окна.
   */
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }

    // Очистка состояния конструктора и данных модального окна при успешном завершении заказа
    return () => {
      if (orderModalData) {
        localStorage.removeItem('orderId');
        dispatch(orderActions.clearOrderModalDataAction());
        dispatch(burgerConstructorActions.clearIngredients());
      }
    };
  }, [dispatch, user, orderModalData]);

  /**
   * Функция для закрытия модального окна с информацией о заказе.
   * Очищает данные о заказе и состояние конструктора.
   */
  const closeOrderModal = () => {
    dispatch(orderActions.clearOrderModalDataAction());
    dispatch(burgerConstructorActions.clearIngredients());
    localStorage.removeItem('orderId');
  };

  /**
   * Функция для обработки нажатия кнопки "Оформить заказ".
   * Проверяет, авторизован ли пользователь, и отправляет данные заказа на сервер.
   */
  const onOrderClick = () => {
    if (!bun || orderRequest) return;

    if (!user) {
      return navigate('/login');
    }

    const bunId = bun._id;
    const ingredientsIds = ingredients.map((item) => item._id);
    const orderData = [bunId, ...ingredientsIds, bunId];

    dispatch(fetchOrderBurger(orderData));
  };

  /**
   * useMemo для вычисления общей стоимости бургера.
   * Включает стоимость булочки (удвоенную) и всех добавленных ингредиентов.
   */
  const calculatePrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) =>
        total + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  return (
    <BurgerConstructorUI
      price={calculatePrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
