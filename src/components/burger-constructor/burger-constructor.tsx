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
 * Компонент для сборки бургера.
 * Включает логику добавления ингредиентов, оформления заказа и расчета стоимости.
 */
export const BurgerConstructor: FC = () => {
  // Hooks
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const user = useSelector(userSelectors.userSelector);
  const bun = useSelector(burgerConstructorSelectors.bunSelector);
  const ingredients = useSelector(
    burgerConstructorSelectors.ingredientsSelector
  );
  const orderRequest = useSelector(orderSelectors.isLoadingSelector);
  const orderModalData = useSelector(orderSelectors.orderSelector);

  // Effects
  useEffect(() => {
    if (!user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  // Handlers

  /**
   * Обработка клика на кнопку оформления заказа.
   * Проверяет, есть ли пользователь и выбранные ингредиенты, и отправляет заказ.
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
   * Обработка закрытия модального окна с информацией о заказе.
   * Очищает данные о заказе и ингредиентах в конструкторе.
   */
  const closeOrderModal = () => {
    dispatch(orderActions.clearOrderModalDataAction());
    dispatch(burgerConstructorActions.clearIngredients());
  };

  // Calculations

  /**
   * Расчет общей стоимости бургера.
   * Включает цену булочки (удвоенную) и цену всех выбранных ингредиентов.
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

  // Render
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
