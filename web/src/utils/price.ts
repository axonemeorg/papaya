export const getPriceString = (price: number): string => {
    const isNetPositive = price > 0;
    return isNetPositive
        ? `+$${Number(price / 100).toFixed(2)}`
        : `$${Number(price / -100).toFixed(2)}`
}
