import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstructorActions } from '../../services/slices/burger-constructor-slice';

/**
 * Компонент для отображения отдельного ингредиента бургера.
 * Обеспечивает функциональность добавления ингредиента в конструктор.
 *
 * @param {TBurgerIngredientProps} props - Пропсы, содержащие информацию о ингредиенте и количестве выбранных ингредиентов.
 */
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    /**
     * Функция для добавления ингредиента в конструктор.
     * Использует действие addIngredient из слайса burgerConstructorActions.
     */
    const handleAdd = () => {
      dispatch(
        burgerConstructorActions.addIngredient({
          ...ingredient,
          id: ingredient._id
        })
      );
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient} // Данные ингредиента для отображения
        count={count} // Количество выбранных ингредиентов
        locationState={{ background: location }} // Состояние для маршрутизации (используется для модальных окон)
        handleAdd={handleAdd} // Обработчик добавления ингредиента
      />
    );
  }
);
