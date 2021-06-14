// A set of functions for interfacing with the Last.fm API

import { RecordAPI } from '@components/Album/Album'
import { MD5 } from 'crypto-js'
import { Track } from 'pages/[artist]/[album]'
import React from 'react'

// * UTILITIES * //

// Function: Returns song track length in seconds
export const trackLengthToSeconds = (duration: string) => {
	const timeArray = duration.split(':')
	const seconds = Number(timeArray[0]) * 60 + Number(timeArray[1])

	return seconds
}

// * AUTHORISATION * //

// Function: Confirms whether user is authenticated via Last.fm and triggers auth flow if not
export const authLastFM = async () => {
	// Retrieve session key & return if found
	const sessionKey = localStorage.getItem('scrobble_session')
	if (sessionKey !== null) return sessionKey

	// Fetch token from URL
	const token = new URLSearchParams(window.location.search).get('token')

	// Send user to authorise Last.fm if token isn't present
	if (!token) {
		const location = window.location
		window.location.href = `https://www.last.fm/api/auth?api_key=${process.env.NEXT_PUBLIC_LASTFM}&cb=${location}`
	}
}

// Function: Checks for an auth token in the URL and saves to local storage if found
export const checkForAuthToken = async () => {
	// Check for token in URL parameters
	const token = new URLSearchParams(window.location.search).get('token')

	if (token) {
		// Generate a new session query
		const query: { [key: string]: string | number } = {
			method: 'auth.getSession',
			api_key: process.env.NEXT_PUBLIC_LASTFM as string,
			token: token as string
		}
		query.api_sig = createLastFMSignature(query)

		// Send API request
		const response = await fetch(
			`https://ws.audioscrobbler.com/2.0/?method=${query.method}&api_key=${query.api_key}&token=${query.token}&api_sig=${query.api_sig}&format=json`
		)
		const sessionKeyResponse = await response.json()

		// Validate session key
		if (sessionKeyResponse.error) {
			console.warn(`Last.fm Auth: ${sessionKeyResponse.message}`)
			return
		}

		// Store session key
		const sessionKey = sessionKeyResponse.session.key as string
		localStorage.setItem('scrobble_session', sessionKey)

		// Remove token from URL
		window.location.search = ''
	}
}

// Function: Generates an API request signature in the bespoke manner required by Last.fm
export const createLastFMSignature = (body: { [key: string]: string | number }) => {
	// Sort incoming JSON object into ASCII order by key
	// NB: important that album[10] comes before album[1] (ASCII order)
	// Map then fetches the original key values and concatenates key + value into a string
	const sortedBody = Object.keys(body)
		.sort()
		.map((key: string) => {
			const string = `${key}${body[key]}`
			return string
		})

	// Collapse into a string and add API secret
	const signature = sortedBody.join('') + 'baef49b8816fa313d0a83dfd76991526'

	// Return collapsed array, MD5 hashed, and stringified (MD5 outputs 4-part array)
	return MD5(signature).toString()
}

// * QUERIES * //

// Function: Query an album on the Last.fm database
export const queryAlbum = async (artist: string, album: string) => {
	const response = await fetch(
		`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
			process.env.NEXT_PUBLIC_LASTFM
		}&artist=${encodeURI(artist)}&album=${encodeURI(album)}&format=json`
	)
	const albumDetails = await response.json()
	return albumDetails
}

// * MUTATIONS * //

// Function: Scrobble an individual track
export const scrobbleTrack = async (
	track: Track,
	album: RecordAPI,
	setResponse: React.Dispatch<React.SetStateAction<string>>
) => {
	// Create API query body
	const time = Math.round(new Date().getTime() / 1000) // gets current time; converts to UNIX epoch (milliseconds); divides to seconds; rounds to nearest whole
	const query: { [key: string]: string | number } = {
		method: 'track.scrobble',
		'album[0]': album.title,
		'artist[0]': album.artist[0],
		'duration[0]': trackLengthToSeconds(track.length),
		'timestamp[0]': time,
		'track[0]': track.name,
		'trackNumber[0]': track.number,
		api_key: 'e96d6830ecf3c0738feb7674574f622e',
		sk: 'YgI64Y-TH1ze3UBGFlt_VF4YGBIM6X8d'
	}

	// Create auth signature and add to query; must be MD5 hashed and contain all keys in alphabetical order, plus account secret
	query.api_sig = createLastFMSignature(query)
	query.format = 'json'

	// Send track to Last.fm API and capture response
	const response = await fetch(`https://ws.audioscrobbler.com/2.0/`, {
		method: 'POST',
		body: new URLSearchParams(query as Record<string, string>).toString(),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		}
	})
	const apiResponse = await response.json()

	// Flag error message if received in response
	if (apiResponse.error) {
		console.error(`Last.fm Scrobble: ${apiResponse.message}`)
		setResponse('error')
		return
	}

	// If all validation passes, set as success
	setResponse('success')
}

// Function: Scrobble an entire album
export const scrobbleAlbum = async (
	tracks: Track[],
	album: RecordAPI,
	setResponse: React.Dispatch<React.SetStateAction<string>>
) => {
	// Confirm authentication
	const sessionKey = await authLastFM()

	// Create empty API query
	const query: { [key: string]: string | number } = {}

	// Add track details for array
	tracks.forEach((track, index) => {
		query[`album[${index}]`] = album.title
		query[`artist[${index}]`] = album.artist[0]
		query[`duration[${index}]`] = trackLengthToSeconds(track.length)
		query[`timestamp[${index}]`] = Math.round(new Date().getTime() / 1000) // converts current time to UNIX (ms); divides to seconds; rounds to integer
		query[`track[${index}]`] = track.name
		query[`trackNumber[${index}]`] = track.number
	})

	// Add standard API parameters
	query.method = 'track.scrobble'
	query.api_key = process.env.NEXT_PUBLIC_LASTFM as string
	query.sk = sessionKey as string

	// Generate signature from existing object and return as new query parameter
	query.api_sig = createLastFMSignature(query)
	query.format = 'json'

	// Send to Last.fm API in 50 track bundles and capture response
	const response = await fetch(`https://ws.audioscrobbler.com/2.0/`, {
		method: 'POST',
		body: new URLSearchParams(query as Record<string, string>).toString(),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		}
	})
	const apiResponse = await response.json()

	// Flag error message if received in response
	if (apiResponse.error) {
		console.error(`Last.fm Scrobble: ${apiResponse.message}`)
		setResponse('error')
		return
	}

	// Check number of tracks scrobbled matches album details
	if (tracks.length > apiResponse.scrobbles['@attr'].accepted) {
		const ignoredTracksNum = apiResponse.scrobbles['@attr'].ignored
		console.warn(`Last.fm Scrobble: ${ignoredTracksNum} tracks failed to scrobble from album.`)
		setResponse('warn')
		return
	}

	// If all validation passes, set as success
	setResponse('success')
}
