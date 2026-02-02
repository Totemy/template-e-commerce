export type AtLeastOne<T> = {
    [K in keyof T]-?: { [P in K]-?: NonNullable<T[P]> } & Partial<Omit<T, K>>
}[keyof T]
