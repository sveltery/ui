/**
 * The useUniqueId hook returns a unique ID that is either reused from external props or generated internally.
 * Either way the ID is now guaranteed to be present so no more nulls or undefined.
 */
export type WithIdRequired<T> = T & {
  id: string;
};
export type WithoutId<T> = Omit<T, 'id'>;
