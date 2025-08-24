type RGB = { r: number; g: number; b: number }

// Function: Takes a hex code and lightens or darkens it
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

// Function: Converts a hex code to RGB
function hexToRgb(hex: string) {
	// Remove leading '#'
	hex = hex.replace('#', '')

	// Convert 3-digit hex to 6-digit (duplicates digits e.g. #abc -> #aabbcc)
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((c) => c + c)
			.join('')
	}

	// Convert each pair to base-16 integer
	const int = parseInt(hex, 16)

	// Extract RGB values (bitshifts by 16 points, then masks with 255)
	return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 }
}

// Function: Calculates luminance value
function srgbToLinear(colour: number) {
	colour = colour / 255
	return colour <= 0.04045 ? colour / 12.92 : Math.pow((colour + 0.055) / 1.055, 2.4)
}

// Function: Calculates relative luminance of an RGB colour
function relativeLuminance({ r, g, b }: RGB) {
	const R = srgbToLinear(r)
	const G = srgbToLinear(g)
	const B = srgbToLinear(b)
	return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

// Function: Calculates contrast ratio between two RGB colours
function contrastRatio(rgb1: RGB, rgb2: RGB) {
	const L1 = relativeLuminance(rgb1)
	const L2 = relativeLuminance(rgb2)
	const lighter = Math.max(L1, L2)
	const darker = Math.min(L1, L2)
	return (lighter + 0.05) / (darker + 0.05)
}

// Function: Converts RGB to HSL
function rgbToHsl({ r, g, b }: RGB) {
	// Normalise colours to 0-1 range
	r /= 255
	g /= 255
	b /= 255

	// Find min and max values of RGB
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)

	// Calculate HSL values
	let h = 0
	let s = 0
	const l = (max + min) / 2
	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			default:
				h = (r - g) / d + 4
				break
		}
		h /= 6
	}
	return { h: h * 360, s: s * 100, l: l * 100 }
}

// Function: Adjusts colour to ensure sufficient contrast
export function adjustContrast(inputHex: string, bgHex = '#FFFFFF', minContrast = 4.5) {
	if (!inputHex) return '#354797' // default blue

	// Convert to RGB and test contrast against background
	const inputRGB = hexToRgb(inputHex)
	const bgRGB = hexToRgb(bgHex)
	if (contrastRatio(inputRGB, bgRGB) >= minContrast) {
		return inputHex // contrast is sufficient
	}

	// If contrast is insufficient, adjust to approved colours
	const spectrum = getSpectrum(inputHex)

	// Fallback colours (assumes white background)
	switch (spectrum) {
		case 'red':
			return '#d62828' // dark red
		case 'orange':
			return '#b75e00' // dark orange
		case 'yellow':
			return '#8F7200' // dark yellow
		case 'green':
			return '#008a1c' // dark green
		case 'cyan':
			return '#008672' // dark cyan
		case 'blue':
			return '#4361ee' // dark blue
		case 'purple':
			return '#c000bd' // dark purple
		default:
			return '#354797' // blue
	}
}

// Function: Converts any hex code to a basic colour name (e.g. #ff0000 -> "red")
export function getSpectrum(hex: string): string {
	const rgb = hexToRgb(hex)
	const hsl = rgbToHsl(rgb)

	// Check for greyscale (low saturation)
	if (hsl.s < 10) {
		if (hsl.l < 15) return 'black'
		if (hsl.l > 85) return 'white'
		return 'grey'
	}

	const h = hsl.h

	if (h >= 0 && h < 25) return 'red'
	if (h >= 25 && h < 50) return 'orange'
	if (h >= 50 && h < 90) return 'yellow'
	if (h >= 90 && h < 150) return 'green'
	if (h >= 150 && h < 210) return 'cyan'
	if (h >= 210 && h < 270) return 'blue'
	if (h >= 270 && h < 330) return 'purple'
	return 'red' // wrap-around for magenta hues
}
