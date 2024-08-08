import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import { useSelector } from '../../services/store';

/**
 * Компонент для отображения и управления ингредиентами бургера.
 * Обеспечивает функциональность выбора вкладок (булки, начинки, соусы) и скроллинга.
 */
export const BurgerIngredients: FC = () => {
  // Получаем список ингредиентов из глобального состояния Redux
  const ingredients = useSelector(ingredientsSelectors.ingredientsSelector);

  // Фильтруем ингредиенты по типам: булки, начинки и соусы
  const buns = ingredients?.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients?.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients?.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  // Локальное состояние для хранения текущей активной вкладки
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Реfs для заголовков секций
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Используем useInView для отслеживания видимости секций ингредиентов
  const [bunsRef, inViewBuns] = useInView({
    threshold: 0
  });
  const [mainsRef, inViewFilling] = useInView({
    threshold: 0
  });
  const [saucesRef, inViewSauces] = useInView({
    threshold: 0
  });

  // useEffect для обновления активной вкладки на основе видимости секций
  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  /**
   * Обработка клика на вкладку.
   * Обновляет текущую активную вкладку и прокручивает к соответствующей секции.
   *
   * @param {string} tab - Вкладка, на которую кликнули.
   */
  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    if (tab === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tab === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab} // Текущая активная вкладка
      buns={buns} // Список булок
      mains={mains} // Список начинок
      sauces={sauces} // Список соусов
      titleBunRef={titleBunRef} // Реf для заголовка секции булок
      titleMainRef={titleMainRef} // Реf для заголовка секции начинок
      titleSaucesRef={titleSaucesRef} // Реf для заголовка секции соусов
      bunsRef={bunsRef} // Реf для секции булок (для отслеживания видимости)
      mainsRef={mainsRef} // Реf для секции начинок (для отслеживания видимости)
      saucesRef={saucesRef} // Реf для секции соусов (для отслеживания видимости)
      onTabClick={onTabClick} // Обработчик клика на вкладку
    />
  );
};
