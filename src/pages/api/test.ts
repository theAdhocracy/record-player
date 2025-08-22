export const prerender = false

import type { APIRoute } from 'astro'

// Global variable to track the last execution time
let lastExecutionTime: number | null = null

export const POST: APIRoute = async ({ request }) => {
	const currentTime = Date.now()

	// Check if the last execution was less than 10 seconds ago (debounce)
	if (lastExecutionTime && currentTime - lastExecutionTime < 10000) {
		return new Response(
			JSON.stringify({
				message: 'Too many requests. Please wait before trying again.'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 429
			}
		)
	}

	// Update the last execution time
	lastExecutionTime = currentTime

	const data = await request.json()
	const user = data.user

	// Validate user account
	const validUser = user === import.meta.env.LASTFM_USER

	if (!validUser) {
		return new Response(
			JSON.stringify({
				message: 'Invalid user. Access denied.'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 403
			}
		)
	}

	return new Response(JSON.stringify({ message: 'POST received!', received: user }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	})
}
