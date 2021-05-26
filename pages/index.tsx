import React from 'react'
import styled from 'styled-components'
import { RecordAPI } from '../components/Album/Album'
import Page from '../components/Page/Page'
import { adjustColour } from '@utils/ColourAdjust'
import { AlbumGrid } from '@components/AlbumGrid/AlbumGrid'

const StyledPage = styled(Page)`
	main {
		max-width: 110rem;
		margin: 0 auto;
		padding: 0 1rem;

		h1,
		p {
			grid-column: 1 / -1;
			text-align: center;
		}

		dfn,
		span.dfn {
			color: #354797;
		}

		h1 {
			margin-bottom: 3rem;
			font-size: 5rem;
			line-height: 0.85;

			span {
				display: block;
				margin-bottom: 0.2em;
				font-size: 0.35em;
				text-transform: lowercase;
				font-weight: 400;
				font-style: italic;
				color: ${adjustColour('#3f3f3f', 80)};
			}
		}

		p {
			margin: 1rem 0 3rem;

			a {
				font-weight: bold;
				text-underline-position: auto;
				text-decoration-line: underline;
				text-decoration-color: #354797;
				text-decoration-thickness: 3px;

				:hover,
				:focus {
					color: #354797;
					text-decoration-color: #000000;
					outline: none;
				}
			}
		}

		@media screen and (min-width: 500px) {
			padding: 0 5rem;
		}
	}
`

export default function Home({ records }: HomeTypes): JSX.Element {
	return (
		<StyledPage>
			<h1>
				<span>An ad hoc</span> Hall of Records
			</h1>
			<p>
				<span className="dfn">
					&#10100; <dfn title="discophilia">dis•co•phil•i•a</dfn> &#10101;
				</span>{' '}
				The enjoyment, collection, and study of musical recordings, often in the form of phonograph
				records and/or CDs.
			</p>
			<p>
				Or, to put it another way: <a href="https://theadhocracy.co.uk/">my</a> music collection.
			</p>
			<AlbumGrid albums={records} />
		</StyledPage>
	)
}

type HomeTypes = {
	records: RecordAPI[]
}

export async function getStaticProps() {
	// Fetch records
	const res = await fetch('https://cms.theadhocracy.co.uk/music.json')
	const records = await res.json()

	return {
		props: {
			records: records.data
		}
	}
}

export const config = {
	unstable_runtimeJS: false
}
