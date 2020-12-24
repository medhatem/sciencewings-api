export type KeysEnum<T> = { [P in keyof Partial<Required<T>>]: true | KeysEnum<T[P]> };
