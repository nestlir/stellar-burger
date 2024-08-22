import reducer, { fetchIngredients } from '../slices/ingredientsSlice';
import { TIngredient } from '../../utils/types';

// Определение TIngredientsState прямо в тестовом файле
type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

describe('ingredients reducer', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен изменить isLoading на true при fetchIngredients.pending', () => {
    const action = fetchIngredients.pending('', undefined);
    const state = reducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('должен сохранить ингредиенты и изменить isLoading на false при fetchIngredients.fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Bun',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 150,
        price: 2,
        image: 'image_url',
        image_large: 'image_large_url',
        image_mobile: 'image_mobile_url'
      }
    ];
    const action = fetchIngredients.fulfilled(ingredients, '', undefined);
    const state = reducer(initialState, action);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.isLoading).toBe(false);
  });

  it('должен сохранить ошибку и изменить isLoading на false при fetchIngredients.rejected', () => {
    const error = 'Failed to fetch';
    const action = fetchIngredients.rejected(new Error(), '', undefined, error);
    const state = reducer(initialState, action);
    expect(state.error).toBe(error);
    expect(state.isLoading).toBe(false);
  });
});
