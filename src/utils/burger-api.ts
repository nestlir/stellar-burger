import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const URL = process.env.BURGER_API_URL;

/**
 * Функция для проверки ответа сервера.
 * Если ответ успешен (res.ok), возвращает распарсенные данные в формате JSON.
 * В противном случае возвращает отклоненное обещание с ошибкой.
 *
 * @param {Response} res - Ответ от сервера.
 * @returns {Promise<T>} - Обещание с данными или ошибкой.
 */
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

/**
 * Общий тип ответа от сервера с полем успеха.
 */
type TServerResponse<T> = {
  success: boolean;
} & T;

/**
 * Тип ответа для обновления токенов доступа и обновления.
 */
type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

/**
 * Функция для обновления токена доступа.
 * Запрашивает новый токен доступа и обновления, сохраняет их и возвращает.
 *
 * @returns {Promise<TRefreshResponse>} - Обещание с новыми токенами.
 */
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

/**
 * Функция для выполнения запроса с автоматическим обновлением токена при необходимости.
 * Если токен истек, функция автоматически обновляет его и повторяет запрос.
 *
 * @param {RequestInfo} url - URL для запроса.
 * @param {RequestInit} options - Настройки запроса.
 * @returns {Promise<T>} - Обещание с данными ответа.
 */
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

/**
 * Тип ответа сервера для получения ингредиентов.
 */
type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

/**
 * Тип ответа сервера для получения ленты заказов.
 */
type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

/**
 * Функция для получения списка ингредиентов.
 *
 * @returns {Promise<TIngredient[]>} - Обещание со списком ингредиентов.
 */
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

/**
 * Функция для получения ленты заказов.
 *
 * @returns {Promise<TFeedsResponse>} - Обещание с данными ленты заказов.
 */
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/**
 * Функция для получения заказов пользователя с автоматическим обновлением токена.
 *
 * @returns {Promise<TOrder[]>} - Обещание со списком заказов.
 */
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

/**
 * Тип ответа сервера при создании нового заказа.
 */
type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

/**
 * Функция для создания нового заказа.
 *
 * @param {string[]} data - Список идентификаторов ингредиентов.
 * @returns {Promise<TNewOrderResponse>} - Обещание с данными нового заказа.
 */
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

/**
 * Тип ответа сервера для получения заказа по номеру.
 */
type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

/**
 * Функция для получения заказа по номеру.
 *
 * @param {number} number - Номер заказа.
 * @returns {Promise<TOrderResponse>} - Обещание с данными заказа.
 */
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

/**
 * Тип данных для регистрации нового пользователя.
 */
export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

/**
 * Тип ответа сервера при аутентификации (регистрация/логин).
 */
type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

/**
 * Функция для регистрации нового пользователя.
 *
 * @param {TRegisterData} data - Данные для регистрации.
 * @returns {Promise<TAuthResponse>} - Обещание с данными о зарегистрированном пользователе.
 */
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/**
 * Тип данных для авторизации пользователя.
 */
export type TLoginData = {
  email: string;
  password: string;
};

/**
 * Функция для авторизации пользователя.
 *
 * @param {TLoginData} data - Данные для входа.
 * @returns {Promise<TAuthResponse>} - Обещание с данными о пользователе.
 */
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/**
 * Функция для запроса на восстановление пароля.
 *
 * @param {object} data - Объект с email пользователя.
 * @returns {Promise<TServerResponse<{}>>} - Обещание с результатом запроса.
 */
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/**
 * Функция для сброса пароля.
 *
 * @param {object} data - Объект с новым паролем и токеном для сброса.
 * @returns {Promise<TServerResponse<{}>>} - Обещание с результатом сброса пароля.
 */
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

/**
 * Тип ответа сервера для получения данных пользователя.
 */
type TUserResponse = TServerResponse<{ user: TUser }>;

/**
 * Функция для получения данных о пользователе с автоматическим обновлением токена.
 *
 * @returns {Promise<TUserResponse>} - Обещание с данными пользователя.
 */
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

/**
 * Функция для обновления данных пользователя.
 *
 * @param {Partial<TRegisterData>} user - Частичные данные пользователя для обновления.
 * @returns {Promise<TUserResponse>} - Обещание с обновленными данными пользователя.
 */
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

/**
 * Функция для выхода пользователя из системы.
 *
 * @returns {Promise<TServerResponse<{}>>} - Обещание с результатом выхода.
 */
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
