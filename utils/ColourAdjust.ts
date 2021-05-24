// Function: takes a hex code and lightens or darkens it
// OG: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
export const adjustColour = (colour: string, amount: number) => {
	return (
		'#' +
		colour
			.replace(/^#/, '')
			.replace(/../g, (colour) =>
				('0' + Math.min(255, Math.max(0, parseInt(colour, 16) + amount)).toString(16)).substr(-2)
			)
	)
}
