import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Vinyl from '@components/Vinyl/Vinyl'
import Page from '@components/Page/Page'
import { RecordAPI } from '@components/Album/Album'
import { Sluggify } from '@utils/Sluggify'
import { adjustColour } from '@utils/ColourAdjust'
import Error404 from '@components/404/404'
import Loading from '@components/Loading/Loading'

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
		z-index: 1;
	}

	section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: calc(50vw - 130px); // 130px is min height of footer
		margin-top: 2rem;
		width: 100%;
	}

	button {
		max-width: 8rem;
		align-self: start;
		justify-self: end;
		padding: 0.4rem 0.7rem;
		background-color: ${({ colour }) => colour};
		border: 2px solid ${({ colour }) => colour};
		border-radius: 4px;
		color: #ffffff;
		line-height: 1;
		cursor: pointer;

		&:hover {
			filter: brightness(1.4);
		}
	}

	@media screen and (min-width: 620px) {
		main {
			position: relative;
			overflow: hidden;
			display: grid;
			grid-template-columns: 12vh 1fr;
			grid-template-rows: max-content min-content 1fr;
			gap: 1rem;
			max-width: unset;
			margin: 0;

			h1 {
				grid-column: 1 / -1;
				grid-row: 1;
				align-self: start;
				justify-self: end;
				max-width: 8em;
				margin: 0;
				padding: 2rem 1rem 0;
				font-size: 7rem;
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
				margin: 2rem 1rem 0;
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
			h1 {
				margin-right: 10%;
			}

			button {
				margin-right: 13%;
			}
		}
	}

	@media screen and (min-width: 1200px) {
		main {
			grid-template-columns: 15vh 1fr 55vh;
			padding: 0;

			h1 {
				grid-column: auto;
				min-width: 5.5em;
				font-size: 8rem;
				margin-right: 0;
				padding-right: 0;
			}

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
				margin-right: 0;
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
				gap: 2rem clamp(2rem, 6rem, 10rem);
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
				display: grid;
				grid-template-columns: repeat(2, minmax(23rem, max-content));
				justify-content: end;
				justify-items: end;
				gap: 5rem;
				max-width: 80rem;
			}
		}
	}
`

const Tracklist = styled.table<{ colour: string }>`
	width: 95%;
	height: max-content;
	max-width: 22rem;

	h3 {
		margin: 0 0 1rem;
		text-align: left;
	}

	td {
		vertical-align: baseline;

		span {
			display: block;
			margin-bottom: 0.2em;
			font-size: 0.8em;
			font-style: italic;
			opacity: 0.5;
		}

		a:hover,
		a:focus {
			opacity: 1;
			color: #354797;
			outline: none;

			::after {
				content: '↬';
			}
		}
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
		td:nth-of-type(2) {
			padding-right: 1.5rem;
		}
	}
`

export const AlbumPage = ({ album, error }: { album: RecordAPI; error: boolean }) => {
	const router = useRouter()

	if (router.isFallback) {
		return <Loading />
	}

	if (error) {
		return <Error404 />
	}

	// Work out tracks per side
	let aSide = 1
	if (album.details.vinyl) {
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
									const featuredArtists = track.features?.split(' | ')

									const featuredString = album.artist[0] !== 'Soundtrack' ? 'feat. ' : ''
									// console.log(featuredArtists.join(', '))
									return (
										<>
											<tr key={track.number}>
												<td>#{track.number}</td>
												<td>
													{track.name}
													{/* Featured artist */}
													{track.features && (
														<span>
															{featuredString}
															{featuredArtists.map((artist, index) =>
																track.link ? (
																	<a href={`/${Sluggify(artist)}`}>{` ${artist}`}</a>
																) : (
																	`${artist}${
																		index + 1 < featuredArtists.length
																			? index + 1 < featuredArtists.length - 1
																				? ', '
																				: ' & '
																			: ''
																	}`
																)
															)}
														</span>
													)}
												</td>
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
			album: record.slug,
			artist: Sluggify(record.artist[0])
		}
	}))

	return {
		paths,
		fallback: 'blocking'
	}
}

export async function getStaticProps({ params }: { params: { album: string; artist: string } }) {
	// Fetch records
	const url = encodeURIComponent(`${params.artist}-${params.album}.json`) // allows for special chars
	const res = await fetch(`https://cms.theadhocracy.co.uk/album/${url}`)
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

export type Track = {
	number: number
	name: string
	length: string
	side: string
	features: string
	link: boolean
}

export const config = {
	unstable_runtimeJS: false
}
