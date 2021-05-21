import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Vinyl from '@components/Vinyl/Vinyl'
import Page from '@components/Page/Page'
import { RecordAPI } from '@components/Album/Album'
import { Sluggify } from '@utils/Sluggify'

const StyledPage = styled(Page)`
	main {
		position: relative;
		overflow: hidden;

		svg {
			position: absolute;
			height: 100%;
			right: 0;
			top: 0;
			transform: translateX(50%);
		}
	}
`

export const AlbumPage = ({ album, error }: { album: RecordAPI; error: boolean }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <div>Loading...</div>
	}

	if (error) {
		return <p>404</p>
	}

	// Work out tracks per side
	let aSide = 1
	if (album.medium === 'vinyl') {
		aSide = album.tracks.filter((track) => track.side === 'A').length
	}

	return (
		<StyledPage>
			<h1>{album.title}</h1>
			<a href="/">Go Home</a>
			<Vinyl
				isRotating={false}
				cover={album.cover.src}
				slug={album.slug}
				trackCount={aSide}
				colour={album.colour}
			/>
		</StyledPage>
	)
}

export default AlbumPage

export async function getStaticPaths() {
	// Fetch records
	const res = await fetch('https://cms.theadhocracy.co.uk/music.json')
	const records = await res.json()

	// Required pages
	const paths = records.data.map((record: RecordAPI) => ({
		params: {
			album: Sluggify(record.title),
			artist: Sluggify(record.artist[0])
		}
	}))

	return {
		paths,
		fallback: true
	}
}

export async function getStaticProps({ params }: { params: { album: string; artist: string } }) {
	// Fetch records
	const res = await fetch(
		`https://cms.theadhocracy.co.uk/album/${params.artist}-${params.album}.json`
	)
	const album = await res.json()

	return {
		props: {
			album: album,
			error: album.error ? true : false
		},
		revalidate: 1
	}
}
