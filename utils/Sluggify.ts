export const Sluggify = (string: string) => {
	const slug = string.toLowerCase().replace(/\s/g, '-')
	return slug
}
