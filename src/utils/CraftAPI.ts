// Fetch data from the API
export const fetchCraftAPI = async (endpoint: string) => {
	const data = await fetch(`${import.meta.env.CRAFT_API_URL as string}${endpoint}`, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${import.meta.env.CRAFT_API_KEY as string}`
		}
	})
		.then(async (response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`)
			}
			const data = await response.json()
			if (data.data) return data.data
			return data
		})
		.catch((error) => {
			console.error(`${error}`)
		})

	return data
}

// Function: Increments the play count of a record
export const incrementPlayCount = async (uri: string) => {
	// Validate session
	const sessionUser = localStorage.getItem('scrobble_user')

	if (!sessionUser) {
		return 'Invalid session'
	}

	// Queries internal server route API to prevent leaking secrets
	const response = await fetch('/api/incrementCount.json', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ user: sessionUser, uri: uri })
	})
		.then((res) => res.json())
		.catch((err) => console.error(err))

	return response
}
