export const prerender = false

import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
	const data = await request.json()
	return new Response(JSON.stringify({ message: 'POST received!', received: data }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	})
}
