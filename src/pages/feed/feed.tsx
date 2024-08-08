import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedSelectors, fetchFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(feedSelectors.ordersSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (!orders.length) return <Preloader />;
  else
    return (
      <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeed())} />
    );
};
