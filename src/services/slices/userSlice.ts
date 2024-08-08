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

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | undefined;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: true,
  error: undefined
};

export const fetchRegisterUser = createAsyncThunk(
  'user/fetchRegisterUser',
  async (registerData: TRegisterData) => await registerUserApi(registerData)
);

export const fetchLoginUser = createAsyncThunk(
  'user/fetchLoginUser',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);

    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    window.location.reload();

    return data;
  }
);

export const fetchUser = createAsyncThunk('user/fetchUser', getUserApi);

export const fetchUpdateUser = createAsyncThunk(
  'user/fetchUpdateUser',
  async (user: TRegisterData) => await updateUserApi(user)
);

export const fetchLogout = createAsyncThunk('user/fetchLogout', async () => {
  logoutApi().then(() => {
    deleteCookie('accessToken');
    window.location.reload();
  });
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.isAuthChecked = false;
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const userSliceActions = userSlice.actions;
export const userSelectors = {
  userSelector: (state: { user: TUserState }) => state.user.user,
  isAuthCheckedSelector: (state: { user: TUserState }) =>
    state.user.isAuthChecked,
  isLoadingSelector: (state: { user: TUserState }) => state.user.isLoading,
  errorSelector: (state: { user: TUserState }) => state.user.error
};
