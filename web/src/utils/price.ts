export const getPriceString = (price: number): string => {
    const isNetPositive = price > 0;
    return isNetPositive
        ? `+$${Number(price).toFixed(2)}`
        : `$${Number(-price).toFixed(2)}`
}
