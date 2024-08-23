import { ReactNode } from 'react';

export interface TModalUIProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}
