import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

// Типы для состояния ингредиентов
type TIngredientsState = {
  ingredients: TIngredient[]; // Список всех доступных ингредиентов
  isLoading: boolean; // Состояние загрузки
  error: string | null; // Сообщение об ошибке
};

// Начальное состояние для ингредиентов
const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: true,
  error: null
};

// Асинхронное действие для получения ингредиентов
export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const response = await getIngredientsApi();
    return response;
  } catch (error) {
    return rejectWithValue('Ошибка при получении ингредиентов');
  }
});

// Создание слайса для управления состоянием ингредиентов
export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload;
          state.isLoading = false;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  }
});

// Селекторы для доступа к состоянию ингредиентов
export const ingredientsSelectors = {
  ingredientsSelector: (state: { ingredients: TIngredientsState }) =>
    state.ingredients.ingredients,
  isLoadingSelector: (state: { ingredients: TIngredientsState }) =>
    state.ingredients.isLoading,
  errorSelector: (state: { ingredients: TIngredientsState }) =>
    state.ingredients.error
};

export default ingredientsSlice.reducer;
