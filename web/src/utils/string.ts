export const getPriceString = (price: number): string => {
	const isNetPositive = price > 0
	return isNetPositive ? `+$${Number(price).toFixed(2)}` : `$${Number(-price).toFixed(2)}`
}

export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes'

	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))
	const size = bytes / Math.pow(k, i)

	let dm = 0
	if (size < 10) {
		dm = 2 // 1 significant figure
	} else if (size < 100) {
		dm = 1 // 2 significant figures
	}

	return `${parseFloat(size.toFixed(dm))} ${sizes[i]}`
}

/**
 * Pluralizes a word.
 *
 * @example p(2, 'apple'); // => 'apples'
 * @example p(null, 'orange'); // => 'oranges'
 * @example p(1, 'banana'); // => 'banana'
 * @example p(10, 'berr', 'y', 'ies'); // => 'berries'
 *
 * @param quantity The quantity used to infer plural or singular
 * @param word The word to pluralize
 * @param {[string]} singularSuffix The suffix used for a singular item
 * @param {[string]} pluralSuffix The suffix used for plural items
 * @returns
 */
export const pluralize = (quantity: number, word: string, singularSuffix = '', pluralSuffix = 's') => {
	return `${word}${quantity === 1 ? singularSuffix : pluralSuffix}`;
};
