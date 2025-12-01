import type { Timestamp } from 'firebase/firestore';

export type WithId<T> = T & { id: string };

export type Item = {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  tags: string[];
  createdAt: Timestamp;
  userId: string;
};
