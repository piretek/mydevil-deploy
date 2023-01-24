export type ColumnMap<T> = {
    [key: string]: T[keyof T]
};
