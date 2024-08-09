import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser } from '../../services/slices/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

/**
 * Главный компонент приложения.
 * Управляет маршрутизацией и состояниями модальных окон.
 */
const App = () => {
  // Используемые хуки
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Локальные состояния для управления модальными окнами
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Получаем предыдущее местоположение для отображения модальных окон на фоне
  const background = location.state && location.state.background;

  // Селекторы для получения состояния конструктора
  const bun = useSelector((state) => state.burgerConstructor.bun);
  const ingredients = useSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const isConstructorAssembled = bun !== null && ingredients.length > 0;

  /**
   * Закрытие модального окна и сброс его содержимого.
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    navigate(-1);
  };

  /**
   * Открытие модального окна с переданным содержимым.
   */
  const openModal = (content: React.ReactNode) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  /**
   * useEffect для загрузки данных ингредиентов и пользователя при монтировании приложения.
   */
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  /**
   * useEffect для проверки состояния страницы.
   * Если страница открыта напрямую и конструктор не собран, перенаправляет пользователя на страницу 404.
   */
  useEffect(() => {
    if (!background) {
      const path = location.pathname.split('/')[1];
      if (path === 'ingredients' && !isConstructorAssembled) {
        navigate('/not-found');
      }
    }
  }, [background, location, isConstructorAssembled, navigate]);

  return (
    <div className={styles.app}>
      {/* Компонент шапки приложения */}
      <AppHeader />

      {/* Основные маршруты приложения */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Маршруты для модальных окон, которые отображаются на фоне */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={'Информация о заказе'} onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={'Информация о заказе'} onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
