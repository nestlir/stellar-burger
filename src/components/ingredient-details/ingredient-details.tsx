import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import { useParams, useLocation } from 'react-router-dom';
import styles from './ingredient-details.module.css'; // Импорт CSS модуля

/**
 * Компонент для отображения деталей конкретного ингредиента.
 * Получает данные ингредиента из состояния Redux по ID, переданному в параметрах URL.
 */
export const IngredientDetails: FC = () => {
  const ingredients = useSelector(ingredientsSelectors.ingredientsSelector);
  const isLoading = useSelector(ingredientsSelectors.isLoadingSelector);
  const { id } = useParams();
  const location = useLocation();

  const ingredientData = ingredients.find((i) => i._id === id);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className={styles.error}>
        <h2>Ингредиент не найден</h2>
      </div>
    );
  }

  // Проверка на наличие background, что указывает на использование модального окна
  const isModal = location.state && location.state.background;

  return (
    <div className={isModal ? '' : styles.container}>
      <div className={isModal ? '' : styles.content}>
        {/* Заголовок отображается только если это не модальное окно */}
        {!isModal && (
          <h3 className='text text_type_main-large'>Детали ингредиента</h3>
        )}
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    </div>
  );
};
