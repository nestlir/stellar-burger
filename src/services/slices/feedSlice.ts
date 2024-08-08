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

// Асинхронное действие для получения данных ленты заказов
export const fetchFeed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feeds/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const response = await getFeedsApi();
    return response;
  } catch (error) {
    return rejectWithValue('Ошибка при получении данных ленты заказов');
  }
});

// Создание слайса для управления состоянием ленты заказов
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFeed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.isLoading = false;
        }
      )
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  }
});

// Селекторы для доступа к состоянию ленты заказов
export const feedSelectors = {
  ordersSelector: (state: { feed: TFeedState }) => state.feed.orders,
  totalSelector: (state: { feed: TFeedState }) => state.feed.total,
  totalTodaySelector: (state: { feed: TFeedState }) => state.feed.totalToday,
  isLoadingSelector: (state: { feed: TFeedState }) => state.feed.isLoading,
  errorSelector: (state: { feed: TFeedState }) => state.feed.error
};

export default feedSlice.reducer;
