import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { ingredientsSelectors } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(ingredientsSelectors.ingredientsSelector);

  const ingredientData = ingredients.find((i) => i._id === useParams().id);

  if (!ingredientData) return <Preloader />;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
