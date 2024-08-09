import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

// Типы для состояния ленты заказов
type TFeedState = TOrdersData & {
  isLoading: boolean; // Состояние загрузки данных
  error: string | null; // Сообщение об ошибке
};

// Начальное состояние для ленты заказов
const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

/**
 * Асинхронное действие для получения данных ленты заказов.
 *
 * @returns Данные ленты заказов, полученные от API.
 */
export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feeds/fetchFeed', async (_, { rejectWithValue }) => {
  const response = await getFeedsApi();
  return response;
});

// Создание слайса для управления состоянием ленты заказов
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка состояния загрузки при начале получения данных
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Сброс ошибки перед новым запросом
      })
      // Обработка успешного получения данных ленты заказов
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders; // Сохранение списка заказов
          state.total = action.payload.total; // Сохранение общего количества заказов
          state.totalToday = action.payload.totalToday; // Сохранение количества заказов за сегодня
          state.isLoading = false; // Сброс состояния загрузки
        }
      )
      // Обработка ошибки при получении данных ленты заказов
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false; // Сброс состояния загрузки
        state.error = action.error.message || 'Неизвестная ошибка'; // Установка сообщения об ошибке
      });
  }
});

// Селекторы для доступа к состоянию ленты заказов
export const feedSelectors = {
  /**
   * Селектор для получения списка заказов.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Список всех заказов.
   */
  ordersSelector: (state: { feed: TFeedState }) => state.feed.orders,

  /**
   * Селектор для получения общего количества заказов.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Общее количество заказов.
   */
  totalSelector: (state: { feed: TFeedState }) => state.feed.total,

  /**
   * Селектор для получения количества заказов за текущий день.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Количество заказов, выполненных за сегодня.
   */
  totalTodaySelector: (state: { feed: TFeedState }) => state.feed.totalToday,

  /**
   * Селектор для проверки состояния загрузки данных ленты заказов.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Булево значение, указывающее на состояние загрузки.
   */
  isLoadingSelector: (state: { feed: TFeedState }) => state.feed.isLoading,

  /**
   * Селектор для получения сообщения об ошибке.
   *
   * @param state - Текущее состояние хранилища.
   * @returns Сообщение об ошибке или null, если ошибки нет.
   */
  errorSelector: (state: { feed: TFeedState }) => state.feed.error
};

export default feedSlice.reducer;
