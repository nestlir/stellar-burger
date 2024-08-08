import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

/**
 * Тип, описывающий состояние пользователя в Redux.
 */
type TUserState = {
  user: TUser | null; // Текущий пользователь
  isAuthChecked: boolean; // Флаг, показывающий, была ли проверена аутентификация
  isLoading: boolean; // Флаг загрузки, показывающий процесс выполнения запроса
  error: string | undefined; // Сообщение об ошибке, если она возникла
};

/**
 * Начальное состояние userSlice.
 */
const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: true,
  error: undefined
};

/**
 * Асинхронный action для регистрации нового пользователя.
 *
 * @param registerData Данные для регистрации пользователя.
 * @returns Ответ от API с данными пользователя.
 */
export const fetchRegisterUser = createAsyncThunk(
  'user/fetchRegisterUser',
  async (registerData: TRegisterData) => await registerUserApi(registerData)
);

/**
 * Асинхронный action для логина пользователя.
 *
 * @param loginData Данные для логина пользователя.
 * @returns Ответ от API с данными пользователя и токенами.
 */
export const fetchLoginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);

    setCookie('accessToken', data.accessToken); // Установка accessToken в cookies
    localStorage.setItem('refreshToken', data.refreshToken); // Сохранение refreshToken в localStorage

    window.location.reload(); // Перезагрузка страницы после логина

    return data;
  }
);

/**
 * Асинхронный action для получения данных о текущем пользователе.
 *
 * @returns Данные текущего пользователя из API.
 */
export const fetchUser = createAsyncThunk('user/fetchUser', getUserApi);

/**
 * Асинхронный action для обновления данных пользователя.
 *
 * @param user Данные пользователя для обновления.
 * @returns Ответ от API с обновленными данными пользователя.
 */
export const fetchUpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async (user: TRegisterData) => await updateUserApi(user)
);

/**
 * Асинхронный action для выхода пользователя из системы.
 *
 * @returns Ответ от API после выхода.
 */
export const fetchLogout = createAsyncThunk('user/fetchLogout', async () => {
  logoutApi().then(() => {
    deleteCookie('accessToken'); // Удаление accessToken из cookies
    window.location.reload(); // Перезагрузка страницы после выхода
  });
});

/**
 * Создание Redux slice для управления состоянием пользователя.
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true; // Установка флага загрузки во время регистрации
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Сохранение данных пользователя после успешной регистрации
        state.isAuthChecked = true; // Установка флага успешной проверки аутентификации
        state.isLoading = false; // Сброс флага загрузки
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isAuthChecked = false; // Установка флага, что аутентификация не прошла
        state.isLoading = false; // Сброс флага загрузки
        state.error = action.error.message; // Сохранение сообщения об ошибке
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true; // Установка флага загрузки во время логина
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Сохранение данных пользователя после успешного логина
        state.isAuthChecked = true; // Установка флага успешной проверки аутентификации
        state.isLoading = false; // Сброс флага загрузки
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isAuthChecked = true; // Установка флага, что аутентификация была проверена
        state.isLoading = false; // Сброс флага загрузки
        state.error = action.error.message; // Сохранение сообщения об ошибке
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true; // Установка флага загрузки во время получения данных пользователя
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user; // Сохранение данных пользователя после успешного получения
        state.isAuthChecked = true; // Установка флага успешной проверки аутентификации
        state.isLoading = false; // Сброс флага загрузки
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true; // Установка флага, что аутентификация была проверена
        state.isLoading = false; // Сброс флага загрузки
        state.error = action.error.message; // Сохранение сообщения об ошибке
      });
  }
});

/**
 * Экспорт действий, доступных в userSlice.
 */
export const userSliceActions = userSlice.actions;

/**
 * Селекторы для получения различных частей состояния пользователя из Redux store.
 */
export const userSelectors = {
  userSelector: (state: { user: TUserState }) => state.user.user, // Селектор для получения текущего пользователя
  isAuthCheckedSelector: (state: { user: TUserState }) =>
    state.user.isAuthChecked, // Селектор для проверки, была ли аутентификация проверена
  isLoadingSelector: (state: { user: TUserState }) => state.user.isLoading, // Селектор для проверки, выполняется ли загрузка
  errorSelector: (state: { user: TUserState }) => state.user.error // Селектор для получения сообщения об ошибке
};
