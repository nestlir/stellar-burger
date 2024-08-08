import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstructorActions } from '../../services/slices/burger-constructor-slice';

/**
 * Компонент для отображения отдельного элемента в конструкторе бургера.
 * Обеспечивает функциональность перемещения ингредиента вверх и вниз, а также удаления ингредиента.
 *
 * @param {BurgerConstructorElementProps} props - Пропсы, содержащие информацию о ингредиенте и его позиции.
 */
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    /**
     * Функция для перемещения ингредиента вниз на одну позицию.
     */
    const handleMoveDown = () => {
      dispatch(
        burgerConstructorActions.dragIngredient({ from: index, to: index + 1 })
      );
    };

    /**
     * Функция для перемещения ингредиента вверх на одну позицию.
     */
    const handleMoveUp = () => {
      dispatch(
        burgerConstructorActions.dragIngredient({ from: index, to: index - 1 })
      );
    };

    /**
     * Функция для удаления ингредиента из конструктора.
     */
    const handleClose = () => {
      dispatch(burgerConstructorActions.removeIngredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
