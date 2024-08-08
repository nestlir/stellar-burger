import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './slices/userSlice';
import { feedSlice } from './slices/feedSlice';
import { ordersSlice } from './slices/orderSlice';
import { ingredientsSlice } from './slices/ingredientsSlice';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { burgerConstructorSlice } from './slices/burger-constructor-slice';

// Объединяем все слайсы в один rootReducer
const rootReducer = combineSlices(
  ingredientsSlice,
  userSlice,
  burgerConstructorSlice,
  ordersSlice,
  feedSlice
);

// Конфигурируем Redux Store
const store = configureStore({
  reducer: rootReducer, // Устанавливаем rootReducer как редюсер для всего состояния
  devTools: process.env.NODE_ENV !== 'production' // Включаем Redux DevTools только в режиме разработки
});

// Тип состояния всего приложения (RootState) - это тип, возвращаемый rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Тип для dispatch, используемый в приложении
export type AppDispatch = typeof store.dispatch;

/**
 * Кастомный хук useDispatch, который возвращает типизированный dispatch.
 *
 * @returns Типизированный dispatch для использования в приложении.
 */
export const useDispatch: () => AppDispatch = () => dispatchHook();

/**
 * Кастомный хук useSelector, типизированный под состояние RootState.
 *
 * @returns Функция, которая позволяет извлекать данные из состояния Redux с типизацией.
 */
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

// Экспортируем настроенный Redux Store для использования в приложении
export default store;
