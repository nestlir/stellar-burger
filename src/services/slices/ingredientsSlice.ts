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

/**
 * Асинхронное действие для получения ингредиентов.
 *
 * @returns Массив ингредиентов, полученных от API.
 */
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
      // Обработка состояния загрузки при начале получения ингредиентов
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Сброс ошибки перед новым запросом
      })
      // Обработка успешного получения ингредиентов
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.ingredients = action.payload; // Сохранение полученных ингредиентов
          state.isLoading = false; // Сброс состояния загрузки
        }
      )
      // Обработка ошибки при получении ингредиентов
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false; // Сброс состояния загрузки
        state.error = action.payload || 'Неизвестная ошибка'; // Установка сообщения об ошибке
      });
  }
});

// Селекторы для доступа к состоянию ингредиентов
export const ingredientsSelectors = {
  /**
   * Селектор для получения списка ингредиентов.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Список всех доступных ингредиентов.
   */
  ingredientsSelector: (state: { ingredients: TIngredientsState }) =>
    state.ingredients.ingredients,

  /**
   * Селектор для проверки состояния загрузки ингредиентов.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Булево значение, указывающее на состояние загрузки.
   */
  isLoadingSelector: (state: { ingredients: TIngredientsState }) =>
    state.ingredients.isLoading,

  /**
   * Селектор для получения сообщения об ошибке.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Сообщение об ошибке или null, если ошибки нет.
   */
  errorSelector: (state: { ingredients: TIngredientsState }) =>
    state.ingredients.error
};

export default ingredientsSlice.reducer;
