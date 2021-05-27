export const Sluggify = (string: string) => {
	const slug = string
		.toLowerCase()
		.replace(/\s/g, '-')
		.replace(/[^a-zA-Z0-9-]*/g, '')
	return slug
}
