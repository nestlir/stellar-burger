import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { burgerConstructorSelectors } from '../../services/slices/burger-constructor-slice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Использование селекторов для получения булочки и ингредиентов отдельно
  const bun = useSelector(burgerConstructorSelectors.bunSelector);
  const constructorIngredients = useSelector(
    burgerConstructorSelectors.ingredientsSelector
  );

  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Подсчет количества каждого ингредиента
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Если булочка добавлена, добавляем её в счетчик
    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
