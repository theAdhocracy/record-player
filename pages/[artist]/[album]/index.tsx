import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Vinyl from '@components/Vinyl/Vinyl'
import Page from '@components/Page/Page'
import { RecordAPI } from '@components/Album/Album'
import { Sluggify } from '@utils/Sluggify'
import { adjustColour } from '@utils/ColourAdjust'

const StyledPage = styled(Page)<{ colour: string }>`
	main {
		padding: 0 1rem;
		max-width: 30rem;
		margin: 0 auto;
	}

	h1 {
		font-size: 4rem;
		margin-bottom: 1rem;
		filter: drop-shadow(-8px -5px ${({ colour }) => adjustColour(colour, 70)})
			drop-shadow(8px 5px ${({ colour }) => adjustColour(colour, 120)});
	}

	svg:not(#artist) {
		position: fixed;
		left: 0;
		bottom: -50vw;
		width: 100vw;
	}

	section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: calc(50vw - 130px); // 130px is min height of footer
		margin-top: 2rem;
	}

	button {
		max-width: 8rem;
		align-self: start;
		justify-self: end;
		padding: 0.4rem 0.7rem;
		background-color: ${({ colour }) => (colour !== '#000000' ? colour : '#354797')};
		border: 2px solid ${({ colour }) => (colour !== '#000000' ? colour : '#354797')};
		border-radius: 4px;
		color: #ffffff;
		line-height: 1;
		cursor: pointer;

		&:hover {
			filter: brightness(1.4);
		}
	}

	@media screen and (min-width: 600px) {
		main {
			position: relative;
			overflow: hidden;

			display: grid;
			grid-template-columns: 12vh 1fr;
			grid-template-rows: max-content min-content 1fr;
			gap: 1rem;
			max-width: unset;
			margin: 0;
			padding: 0 5rem 0 0;

			h1 {
				align-self: start;
				margin: 0 0 0 8vh;
				padding-top: 2rem;
				font-size: 8rem;
				line-height: 0.9;
				text-align: right;
			}

			h2 {
				grid-column: 1;
				grid-row-start: 1;
				grid-row-end: 4;
				margin: 0;
				margin-bottom: 3rem;
				font-size: 9vh;
				writing-mode: vertical-lr;
				align-self: end;
			}

			button {
				grid-column: 2;
				grid-row: 2;
				margin-top: 1.5rem;
			}

			section {
				margin-bottom: calc(55vw - 130px); // 130px is min height of footer
				place-content: center;
			}
		}

		footer {
			margin-top: 1rem;
		}
	}

	@media screen and (min-width: 1000px) {
		main {
			grid-template-columns: 15vh 1fr 55vh;
			padding: 0;

			svg:not(#artist) {
				position: relative;
				left: unset;
				bottom: unset;
				grid-column: 3;
				grid-row-start: 1;
				grid-row-end: 4;
				width: auto;
				height: 100vh;
			}

			button {
				grid-column: 2;
				grid-row: 2;
			}

			section {
				margin: 2rem 0 0;
				justify-content: end;
				align-content: start;
			}
		}
	}

	@media screen and (min-width: 1350px) {
		main {
			svg:not(#artist) {
				margin-left: 5vh;
			}

			section {
				display: flex;
				flex-wrap: wrap;
				gap: 2rem clamp(2rem, 1vw + 2.1rem, 5rem); //NB: not working
				justify-self: end;
				align-self: center;
				height: max-content;
				margin: 0 0 0 8vh;
			}
		}
	}

	@media screen and (min-width: 1750px) {
		main {
			section {
				gap: 5rem 10rem;
			}
		}
	}
`

const Tracklist = styled.table<{ colour: string }>`
	width: 95%;
	height: max-content;

	h3 {
		margin: 0 0 1rem;
		text-align: left;
	}

	td {
		vertical-align: baseline;
	}

	td:nth-of-type(1) {
		width: 2.5rem;
		color: ${({ colour }) => (colour !== '#000000' ? colour : '#354797')};
	}

	td:nth-of-type(2) {
		padding-right: 1rem;
	}

	td:nth-of-type(3) {
		color: rgba(0, 0, 0, 0.5);
		text-align: right;
	}

	@media screen and (min-width: 600px) {
		max-width: 22rem;

		td:nth-of-type(2) {
			padding-right: 1.5rem;
		}
	}
`

export const AlbumPage = ({ album, error }: { album: RecordAPI; error: boolean }) => {
	const router = useRouter()

	if (router.isFallback) {
		// TODO: Make a simple loading animation and explanation message
		return <div>Loading...</div>
	}

	if (error) {
		// TODO: Quirky 404 page
		return <p>404</p>
	}

	// Work out tracks per side
	let aSide = 1
	if (album.medium === 'vinyl') {
		aSide = album.tracks.filter((track) => track.side === 'A').length
	}

	// Shuffle tracks into sides
	// This takes the original array and creates a new array (array) and then runs through the original array; for each item (track) it looks at the OG array and sees if it contains a new child with a key of track.side (e.g. "A"); if it finds one already exists in the new array, it adds the track information; otherwise it creates it
	const sides: Side[] = []
	album.tracks.map((track) => {
		// Check whether an array for the current side exists
		const index = sides.findIndex((item) => item.side === track.side)

		// If no current array is found, create one
		if (index < 0) {
			return sides.push({
				side: track.side,
				tracks: [{ ...track }]
			})
		}

		// Else, add track information to identified array
		return sides[index].tracks.push({ ...track })
	})

	// Set accent colour
	const accent = album.colour === '#000000' ? '#354797' : album.colour

	return (
		<StyledPage colour={accent}>
			<h1>{album.title}</h1>
			<h2>{album.artist.map((artist) => artist)}</h2>
			<button type="button">Scrobble Album</button>

			<Vinyl
				isRotating={false}
				cover={album.cover.src}
				slug={album.slug}
				trackCount={aSide}
				colour={album.colour}
			/>

			<section>
				{sides.map((side) => {
					return (
						<Tracklist key={side.side} colour={album.colour}>
							<caption>
								<h3>
									<span className="sr-only">Tracklist for </span>Side {side.side}
								</h3>
							</caption>
							<thead className="sr-only">
								<th scope="col">Track Number</th>
								<th scope="col">Track Title</th>
								<th scope="col">Track Length</th>
							</thead>
							<tbody>
								{side.tracks.map((track) => {
									const duration = {
										minute: track.length.replace(/:.*$/, ''),
										second: track.length.replace(/^.*:/, '')
									}
									return (
										<>
											<tr key={track.number}>
												<td>#{track.number}</td>
												<td>{track.name}</td>
												<td>
													<time dateTime={`PT${duration.minute}M${duration.second}S`}>
														{track.length}
													</time>
												</td>
											</tr>
										</>
									)
								})}
							</tbody>
						</Tracklist>
					)
				})}
			</section>
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

interface Side {
	side: string
	tracks: Track[]
}

interface Track {
	number: number
	name: string
	length: string
	side: string
}
