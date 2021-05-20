import React from 'react'
import { useRouter } from 'next/router'
import { RecordAPI } from '../../components/Album/Album'
import Page from '../../components/Page/Page'

export const ArtistPage = ({ artist, error }: { artist: ArtistAPI; error: boolean }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	if (error) {
		return <p>404</p>
	}

	return (
		<Page>
			<h1>{artist.title}</h1>
			<a href="/">Go Home</a>
		</Page>
	)
}

export default ArtistPage

export async function getStaticPaths() {
	// Fetch records
	const res = await fetch('https://cms.theadhocracy.co.uk/artists.json')
	const artists = await res.json()

	// Required pages
	const paths = artists.data.map((artist: RecordAPI) => ({
		params: {
			artist: artist.slug
		}
	}))

	return {
		paths,
		fallback: true
	}
}

export async function getStaticProps({ params }: { params: { artist: string } }) {
	// Fetch records
	const res = await fetch(`https://cms.theadhocracy.co.uk/artist/${params.artist}.json`)
	const artist = await res.json()

	return {
		props: {
			artist: artist,
			error: artist.error ? true : false
		},
		revalidate: 1
	}
}

export type ArtistAPI = {
	id: number
	title: string
	slug: string
	albums: RecordAPI[]
}
