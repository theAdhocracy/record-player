import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json()
	const count = body.count + 1
	const id = body.album

	// Validate user account
	const validUser = body.user === import.meta.env.LASTFM_USER

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

	try {
		const response = await fetch(`${import.meta.env.CRAFT_API_URL as string}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${import.meta.env.CRAFT_GQL_TOKEN as string}`
			},
			body: JSON.stringify({ query, variables })
		})

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`)
		}

		const result = await response.json()

		if (result.errors) {
			console.error('GraphQL errors:', result.errors)
			throw new Error('Failed to increment play count')
		}

		return new Response(JSON.stringify(result.data.save_music_record_Entry), {
			headers: {
				'Content-Type': 'application/json'
			},
			status: 200
		})
	} catch (error) {
		console.error('Error incrementing play count:', error)
		throw error
	}
}
