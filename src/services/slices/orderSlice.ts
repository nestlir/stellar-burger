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

/**
 * Асинхронное действие для создания заказа.
 *
 * @param data - Массив идентификаторов продуктов для заказа.
 * @returns Данные заказа, полученные от API.
 */
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

/**
 * Асинхронное действие для получения заказа по его номеру.
 *
 * @param number - Номер заказа.
 * @returns Заказ, полученный по указанному номеру.
 */
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

/**
 * Асинхронное действие для получения всех заказов.
 *
 * @returns Массив всех заказов, полученных от API.
 */
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
    /**
     * Действие для установки данных заказа в модальное окно.
     *
     * @param state - Текущее состояние слайса.
     * @param action - Действие с данными заказа.
     */
    orderModalDataAction: (state, action: PayloadAction<TOrder | null>) => {
      state.order = action.payload;
    },
    /**
     * Действие для очистки данных заказа в модальном окне.
     *
     * @param state - Текущее состояние слайса.
     */
    clearOrderModalDataAction: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка асинхронного действия создания заказа
      .addCase(fetchOrderBurger.pending, (state) => {
        state.isLoading = true; // Установка флага загрузки
        state.error = null; // Сброс сообщения об ошибке
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.order = action.payload; // Установка данных заказа
        state.isLoading = false; // Сброс флага загрузки
      })
      .addCase(fetchOrderBurger.rejected, (state, action) => {
        state.isLoading = false; // Сброс флага загрузки
        state.error = action.payload || 'Неизвестная ошибка'; // Установка сообщения об ошибке
      })

      // Обработка асинхронного действия получения заказа по номеру
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true; // Установка флага загрузки
        state.error = null; // Сброс сообщения об ошибке
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload; // Установка данных заказа
        state.isLoading = false; // Сброс флага загрузки
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false; // Сброс флага загрузки
        state.error = action.payload || 'Неизвестная ошибка'; // Установка сообщения об ошибке
      })

      // Обработка асинхронного действия получения всех заказов
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true; // Установка флага загрузки
        state.error = null; // Сброс сообщения об ошибке
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload; // Установка списка заказов
        state.isLoading = false; // Сброс флага загрузки
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false; // Сброс флага загрузки
        state.error = action.payload || 'Неизвестная ошибка'; // Установка сообщения об ошибке
      });
  }
});

// Экспорт действий слайса для использования в компонентах
export const orderActions = ordersSlice.actions;

// Экспорт селекторов слайса для доступа к данным из хранилища
export const orderSelectors = {
  ordersSelector: (state: RootState) => state.orders.orders, // Селектор для получения списка всех заказов
  orderSelector: (state: RootState) => state.orders.order, // Селектор для получения текущего заказа
  isLoadingSelector: (state: RootState) => state.orders.isLoading, // Селектор для проверки состояния загрузки
  errorSelector: (state: RootState) => state.orders.error // Селектор для получения сообщения об ошибке
};

export default ordersSlice.reducer;
