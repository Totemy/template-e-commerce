export type AtLeastOne<T> = {
    [K in keyof T]-?: { [P in K]-?: NonNullable<T[P]> } & Partial<Omit<T, K>>
}[keyof T]

export const decimalTransformer = {
    to: (value?: number) => (value !== undefined ? value.toString() : value),
    from: (value?: string) =>
        value !== null && value !== undefined ? Number(value) : value,
}
