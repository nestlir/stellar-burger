import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

// Объект для отображения текста статуса заказа
const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

/**
 * Компонент для отображения статуса заказа с соответствующим стилем текста.
 *
 * @param {OrderStatusProps} props - Пропсы, содержащие статус заказа.
 */
export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  // Переменная для хранения цвета текста, в зависимости от статуса заказа
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A'; // Красный цвет для статуса "Готовится"
      break;
    case 'done':
      textStyle = '#00CCCC'; // Бирюзовый цвет для статуса "Выполнен"
      break;
    default:
      textStyle = '#F2F2F3'; // Светло-серый цвет для остальных статусов
  }

  // Возвращаем компонент UI с текстом статуса и соответствующим стилем
  return <OrderStatusUI textStyle={textStyle} text={statusText[status]} />;
};
