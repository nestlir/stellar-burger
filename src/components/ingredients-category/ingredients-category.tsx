import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { burgerConstructorSelectors } from '../../services/slices/burger-constructor-slice';

/**
 * Компонент для отображения категории ингредиентов.
 * Подсчитывает количество ингредиентов, которые уже добавлены в конструктор, и передает данные в UI-компонент.
 *
 * @param {TIngredientsCategoryProps} props - Пропсы, содержащие название категории, реф на заголовок и список ингредиентов.
 * @param {React.Ref<HTMLUListElement>} ref - Реф для списка ингредиентов, используется для прокрутки.
 */
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Использование селекторов для получения булочки и ингредиентов из конструктора
  const bun = useSelector(burgerConstructorSelectors.bunSelector);
  const constructorIngredients = useSelector(
    burgerConstructorSelectors.ingredientsSelector
  );

  /**
   * Мемоизированная функция для подсчета количества каждого ингредиента, добавленного в конструктор.
   * Также учитывается количество булочек, которые добавлены в конструктор.
   */
  const ingredientsCounters = useMemo(() => {
    const counters: { [key: string]: number } = {};

    // Подсчет количества каждого ингредиента
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });

    // Если булочка добавлена, добавляем её в счетчик (2 раза, т.к. используется и сверху, и снизу)
    if (bun) counters[bun._id] = 2;

    return counters;
  }, [bun, constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title} // Название категории ингредиентов
      titleRef={titleRef} // Реф для заголовка категории
      ingredients={ingredients} // Список ингредиентов в категории
      ingredientsCounters={ingredientsCounters} // Счетчики ингредиентов в конструкторе
      ref={ref} // Реф для списка ингредиентов
    />
  );
});
