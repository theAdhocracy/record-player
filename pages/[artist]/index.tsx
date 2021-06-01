import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { RecordAPI } from '@components/Album/Album'
import Page from '@components/Page/Page'
import { AlbumGrid } from '@components/AlbumGrid/AlbumGrid'
import { adjustColour } from '@utils/ColourAdjust'
import Loading from '@components/Loading/Loading'
import Error404 from '@components/404/404'

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
		return <Loading />
	}

	if (error) {
		return <Error404 />
	}

	const accent = artist.albums[0].colour === '#000000' ? '#354797' : artist.albums[0].colour

	// Combine albums and featured albums
	const allAlbums = artist.albums.concat(artist.featured)

	return (
		<StyledPage colour={accent}>
			<h1>{artist.title}</h1>
			<AlbumGrid albums={allAlbums} />
		</StyledPage>
	)
}

export default ArtistPage

export async function getStaticPaths() {
	// Fetch records
	const res = await fetch('https://cms.theadhocracy.co.uk/artists.json')
	let artists = await res.json()

	// Remove artists that don't have albums (featured artists only)
	artists = artists.data.filter((artist: any) => artist.albums?.length > 0)

	// Required pages
	const paths = artists.map((artist: RecordAPI) => ({
		params: {
			artist: artist.slug
		}
	}))

	return {
		paths,
		fallback: 'blocking'
	}
}

export async function getStaticProps({ params }: { params: { artist: string } }) {
	// Fetch records
	const url = encodeURIComponent(params.artist) // allows for special chars
	const res = await fetch(`https://cms.theadhocracy.co.uk/artist/${url}.json`)
	const artist = await res.json()

	// 404 artists that only feature on albums
	if (artist.albums?.length === 0) {
		return {
			props: { error: true }
		}
	}

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
	featured: RecordAPI[]
}

export const config = {
	unstable_runtimeJS: false
}
