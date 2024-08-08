import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './components/app/app';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './services/store';

// Получаем элемент DOM, в который будет монтироваться приложение
const container = document.getElementById('root') as HTMLElement;

// Создаем корень для React-рендера с помощью нового API React 18
const root = ReactDOMClient.createRoot(container!);

// Выполняем рендер приложения
root.render(
  <React.StrictMode>
    {/* Оборачиваем приложение в Provider для доступа к Redux store */}
    <Provider store={store}>
      {/* Используем BrowserRouter для управления маршрутизацией в приложении */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
