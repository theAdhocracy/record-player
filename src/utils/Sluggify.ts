export const Sluggify = (string: string) => {
	const slug = string
		.toLowerCase()
		.replace(/\s/g, '-') // replace whitespace with -
		.replace(/[^a-zA-Z0-9-]*/g, '') // remove all chars except alphanumeric and -
		.replace('--', '-') // replace double -- with -; happens when illegal char is whole word e.g. &
	return slug
}
