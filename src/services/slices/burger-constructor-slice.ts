import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

// Типы состояния для конструктора бургера
type TBurgerConstructorState = {
  bun: TConstructorIngredient | null; // Текущая выбранная булочка
  ingredients: TConstructorIngredient[]; // Список остальных ингредиентов
};

// Начальное состояние конструктора бургера
const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: []
};

// Создание слайса для управления состоянием конструктора бургера
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента в конструктор
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload; // Если добавляется булочка, заменяем текущую
        } else {
          state.ingredients.push(payload); // Если добавляется другой ингредиент, добавляем его в список
        }
      },
      // Подготовка ингредиента перед добавлением: генерация уникального ID
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    // Удаление ингредиента по индексу
    removeIngredient: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    // Перетаскивание ингредиента (изменение порядка)
    dragIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.ingredients];

      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      state.ingredients = ingredients;
    },
    // Очистка всех ингредиентов в конструкторе
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Селекторы для доступа к состоянию конструктора бургера
export const burgerConstructorSelectors = {
  bunSelector: (state: { burgerConstructor: TBurgerConstructorState }) =>
    state.burgerConstructor.bun,
  ingredientsSelector: (state: {
    burgerConstructor: TBurgerConstructorState;
  }) => state.burgerConstructor.ingredients,
  constructorStateSelector: (state: {
    burgerConstructor: TBurgerConstructorState;
  }) => state.burgerConstructor
};

// Экспорт действий для управления состоянием конструктора
export const burgerConstructorActions = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
