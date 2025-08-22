export const prerender = false

import { fetchCraftAPI } from '@/utils/CraftAPI'
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

	// Get current play count
	const uri = 'violets-tale'
	const recordData = await fetchCraftAPI(`/music/record/${uri}`)

	if (!recordData || !recordData.id) {
		return new Response(
			JSON.stringify({
				message: 'Record not found or invalid.'
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				},
				status: 404
			}
		)
	}

	// Extract data from record
	const count = recordData.playCount + 1
	const id = recordData.id

	// GraphQL mutation to increment play count
	const query = `
		mutation AddListenCount($id: ID!, $count: Number) {
			save_music_record_Entry(id: $id, playCount: $count) {
				id
				playCount
			}
		}
	`
	const variables = {
		id,
		count
	}

	const response = await fetch(`${import.meta.env.CRAFT_API_URL as string}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CRAFT_GQL_TOKEN as string}`
		},
		body: JSON.stringify({ query, variables })
	})

	const result = await response.json()

	return new Response(
		JSON.stringify({
			message: 'POST received!',
			received: user,
			status: result.data.save_music_record_Entry
		}),
		{
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		}
	)
}
