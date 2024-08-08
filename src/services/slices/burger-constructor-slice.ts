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
    /**
     * Добавление ингредиента в конструктор.
     * Если добавляется булочка, она заменяет текущую выбранную булочку.
     * Остальные ингредиенты добавляются в список ингредиентов.
     */
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload; // Если добавляется булочка, заменяем текущую
        } else {
          state.ingredients.push(payload); // Если добавляется другой ингредиент, добавляем его в список
        }
      },
      /**
       * Подготовка ингредиента перед добавлением: генерация уникального ID.
       *
       * @param ingredient - Ингредиент, который добавляется в конструктор.
       * @returns Объект с payload, включающим ингредиент с уникальным идентификатором.
       */
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    /**
     * Удаление ингредиента по индексу из списка ингредиентов.
     *
     * @param state - Текущее состояние конструктора.
     * @param payload - Индекс ингредиента, который нужно удалить.
     */
    removeIngredient: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    /**
     * Перетаскивание ингредиента (изменение порядка ингредиентов).
     *
     * @param state - Текущее состояние конструктора.
     * @param payload - Объект с индексами откуда и куда переместить ингредиент.
     */
    dragIngredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.ingredients];

      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      state.ingredients = ingredients;
    },
    /**
     * Очистка всех ингредиентов в конструкторе.
     * Удаляет текущую выбранную булочку и очищает список ингредиентов.
     *
     * @param state - Текущее состояние конструктора.
     */
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Селекторы для доступа к состоянию конструктора бургера
export const burgerConstructorSelectors = {
  /**
   * Селектор для получения текущей выбранной булочки.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Текущая выбранная булочка или null, если булочка не выбрана.
   */
  bunSelector: (state: { burgerConstructor: TBurgerConstructorState }) =>
    state.burgerConstructor.bun,

  /**
   * Селектор для получения списка ингредиентов в конструкторе.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Список всех ингредиентов, добавленных в конструктор.
   */
  ingredientsSelector: (state: {
    burgerConstructor: TBurgerConstructorState;
  }) => state.burgerConstructor.ingredients,

  /**
   * Селектор для получения текущего состояния конструктора бургера.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Текущее состояние конструктора бургера.
   */
  constructorStateSelector: (state: {
    burgerConstructor: TBurgerConstructorState;
  }) => state.burgerConstructor
};

// Экспорт действий для управления состоянием конструктора
export const burgerConstructorActions = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
