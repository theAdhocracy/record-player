import React from 'react'
import styled from 'styled-components'
import { Sluggify } from '../../utils/Sluggify'
import { Vinyl } from '../Vinyl/Vinyl'

const Article = styled.article`
	:focus,
	& *:focus {
		outline: none;
	}

	h2 {
		margin: 0.75rem 0 0.2rem;
		color: #3f3f3f;

		span {
			display: none;
			font-size: 0.8em;
		}

		a:hover,
		a:focus {
			filter: brightness(1.8);

			span {
				display: inline;
			}
		}
	}

	h3 {
		margin: 0.2rem 0;
		font-weight: normal;
		font-style: italic;
		opacity: 0.6;

		a {
			color: blue;
		}

		a:hover,
		a:focus {
			filter: hue-rotate(45deg);
		}
	}

	h2,
	h3 {
		margin-left: 0.5rem;
	}

	:hover,
	:focus {
		h2 span {
			display: inline;
		}
	}

	a:focus + h2 span {
		display: inline;
	}
`

const Cover = styled.a`
	display: block;
	position: relative;
	height: 15rem;
	width: 15rem;

	img {
		z-index: 1;
		border: 8px solid #ececec;
		border-radius: 12px;
		max-width: 100%;
		transition: transform 0.8s ease-in-out, box-shadow 0.8s ease-in;
		box-shadow: 6px 0 15px -12px rgba(0, 0, 0, 0.6);
	}

	svg {
		position: absolute;
		z-index: -1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		transition: transform 0.8s ease-in-out;
	}

	:hover,
	:focus {
		filter: none;

		img {
			transform: translateX(-20%);
			box-shadow: 20px 0 15px -15px rgba(0, 0, 0, 0.6);
		}

		svg {
			transform: translateX(35%) rotate(45deg);
		}
	}
`

export const Album = ({ record }: AlbumTypes) => {
	// Work out number of tracks on A side if vinyl
	let aSide = 1
	if (record.medium === 'vinyl') {
		aSide = record.tracks.filter((track) => track.side === 'A').length
	}

	// Ensure white records aren't invisible
	let colour = record.colour
	if (colour === '#ffffff') {
		colour = '#f1f1f1'
	}

	// Create url
	const url = `/${Sluggify(record.artist[0])}/${Sluggify(record.title)}`

	return (
		<Article>
			<Cover href={url}>
				<img src={record.cover.src} alt={`Cover art: ${record.cover.desc}`} />
				{record.medium === 'vinyl' && (
					<Vinyl slug={record.slug} cover={record.cover.src} trackCount={aSide} colour={colour} />
				)}
			</Cover>
			<h2>
				<a href={url}>
					{record.title} <span>↬</span>
				</a>
			</h2>
			<h3>
				{record.artist.map((artist) => {
					const slug = Sluggify(artist)

					return (
						<a key={slug} href={`/${slug}`}>
							{artist}
						</a>
					)
				})}
			</h3>
		</Article>
	)
}

export type RecordAPI = {
	id: number
	uri: string
	title: string
	slug: string
	date: string
	updated: string
	artist: string[]
	medium: 'vinyl' | 'cd' | 'wanted'
	colour: string
	notes: string
	cover: {
		src: string
		desc: string
	}
	tracks: {
		number: number
		name: string
		length: string
		side: string
	}[]
}

export type AlbumTypes = {
	record: RecordAPI
}
