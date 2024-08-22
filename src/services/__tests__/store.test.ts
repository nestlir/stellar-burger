import store from '../store';

describe('rootReducer', () => {
  it('должен возвращать начальное состояние, если передан неизвестный экшен', () => {
    const initialState = store.getState(); // Получаем начальное состояние от store

    expect(initialState).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        error: null,
        isLoading: true,
        orders: [],
        total: 0,
        totalToday: 0
      },
      ingredients: {
        error: null,
        ingredients: [],
        isLoading: true
      },
      orders: {
        error: null,
        isLoading: false,
        order: null,
        orders: []
      },
      user: {
        error: null,
        isAuthChecked: false,
        isLoading: true,
        user: null
      }
    });
  });

  it('должен возвращать текущее состояние, если передан неизвестный экшен', () => {
    const initialState = store.getState(); // Получаем начальное состояние от store

    // Вызываем rootReducer с неизвестным экшеном и текущим состоянием
    store.dispatch({ type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние не изменилось
    expect(store.getState()).toEqual(initialState);
  });
});
