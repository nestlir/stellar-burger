import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

/**
 * Компонент для отображения деталей конкретного ингредиента.
 * Получает данные ингредиента из состояния Redux по ID, переданному в параметрах URL.
 */
export const IngredientDetails: FC = () => {
  // Получаем список ингредиентов из глобального состояния Redux
  const ingredients = useSelector(ingredientsSelectors.ingredientsSelector);

  // Проверяем, идет ли загрузка ингредиентов
  const isLoading = useSelector(ingredientsSelectors.isLoadingSelector);

  // Получаем ID ингредиента из параметров URL
  const { id } = useParams();

  // Находим данные о конкретном ингредиенте по его ID
  const ingredientData = ingredients.find((i) => i._id === id);

  // Если данные ингредиента не найдены, отображаем прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

  // Если данные ингредиента найдены, но загрузка еще идет, отображаем прелоадер
  if (isLoading) {
    return <Preloader />;
  }

  // Если данные ингредиента найдены и загрузка завершена, отображаем их в компоненте UI
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
