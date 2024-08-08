import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Тип состояния для заказов
type TOrdersState = {
  orders: TOrder[]; // Список всех заказов
  order: TOrder | null; // Текущий заказ, отображаемый в модальном окне
  isLoading: boolean; // Состояние загрузки данных
  error: string | null; // Сообщение об ошибке, если что-то пошло не так
};

// Начальное состояние для заказов
const initialState: TOrdersState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null
};

// Асинхронное действие для создания заказа
export const fetchOrderBurger = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('orders/fetchOrderBurger', async (data, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(data);
    return response.order;
  } catch (error) {
    return rejectWithValue('Ошибка при создании заказа');
  }
});

// Асинхронное действие для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  } catch (error) {
    return rejectWithValue('Ошибка при получении заказа по номеру');
  }
});

// Асинхронное действие для получения всех заказов
export const fetchOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    return rejectWithValue('Ошибка при получении всех заказов');
  }
});

// Создание слайса для управления состоянием заказов
export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Действие для установки данных заказа в модальное окно
    orderModalDataAction: (state, action: PayloadAction<TOrder | null>) => {
      state.order = action.payload;
    },
    // Действие для очистки данных заказа в модальном окне
    clearOrderModalDataAction: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка асинхронного действия создания заказа
      .addCase(fetchOrderBurger.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      })

      // Обработка асинхронного действия получения заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      })

      // Обработка асинхронного действия получения всех заказов
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Неизвестная ошибка';
      });
  }
});

// Экспорт действий слайса для использования в компонентах
export const orderActions = ordersSlice.actions;

// Экспорт селекторов слайса для доступа к данным из хранилища
export const orderSelectors = {
  ordersSelector: (state: RootState) => state.orders.orders,
  orderSelector: (state: RootState) => state.orders.order,
  isLoadingSelector: (state: RootState) => state.orders.isLoading,
  errorSelector: (state: RootState) => state.orders.error
};

export default ordersSlice.reducer;
