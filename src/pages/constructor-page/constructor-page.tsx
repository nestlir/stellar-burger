import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';

/**
 * Компонент страницы конструктора бургера.
 * Включает отображение ингредиентов и конструктора бургера.
 */
export const ConstructorPage: FC = () => {
  // Получаем состояние загрузки ингредиентов из Redux с помощью селектора
  const isIngredientsLoading = useSelector(
    ingredientsSelectors.isLoadingSelector
  );

  return (
    <>
      {isIngredientsLoading ? (
        // Если ингредиенты еще загружаются, отображаем прелоадер
        <Preloader />
      ) : (
        // Если ингредиенты загружены, отображаем основное содержимое страницы
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
