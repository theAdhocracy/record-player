import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { RecordAPI } from '@components/Album/Album'
import Page from '@components/Page/Page'
import { AlbumGrid } from '@components/AlbumGrid/AlbumGrid'
import { adjustColour } from '@utils/ColourAdjust'

const StyledPage = styled(Page)<{ colour: string }>`
	main {
		max-width: 110rem;
		margin: 0 auto;
		padding: 0 1rem;

		h1 {
			margin-bottom: 3rem;
			margin-top: 3rem;
			text-align: center;
			font-size: 4rem;
			filter: drop-shadow(-8px -5px ${({ colour }) => adjustColour(colour, 70)})
				drop-shadow(8px 5px ${({ colour }) => adjustColour(colour, 120)});
		}

		@media screen and (min-width: 600px) {
			padding: 0 5rem;

			h1 {
				font-size: clamp(4rem, 6rem, 8rem);
				line-height: 0.9;
				margin-bottom: 6rem;
			}
		}
	}
`

export const ArtistPage = ({ artist, error }: { artist: ArtistAPI; error: boolean }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	if (error) {
		return <p>404</p>
	}

	const accent = artist.albums[0].colour === '#000000' ? '#354797' : artist.albums[0].colour

	return (
		<StyledPage colour={accent}>
			<h1>{artist.title}</h1>
			<AlbumGrid albums={artist.albums} />
		</StyledPage>
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
