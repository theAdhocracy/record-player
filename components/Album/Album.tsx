import React from 'react'
import styled from 'styled-components'

const Cover = styled.div`
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

		:hover {
			transform: translateX(-20%);
			box-shadow: 20px 0 15px -15px rgba(0, 0, 0, 0.6);

			& + svg {
				transform: translateX(35%) rotate(45deg);
			}
		}
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
`

interface VinylProps {
	cover: string
	slug: string
	trackCount: number
	colour: string
}

const Vinyl = ({ cover, slug, trackCount, colour }: VinylProps) => {
	// Function: takes the start and end points, returns alternating concentric circles as a gradient; tracks value determines which should be black
	const generateGrooves = (start: number, end: number, tracks: number[]) => {
		const grooves = []

		for (let i = start; i <= end; i++) {
			if (tracks.includes(i)) {
				grooves.push(<stop offset={`${i}%`} stopColor={colour} />)
			} else {
				grooves.push(<stop offset={`${i}%`} stopColor={i % 2 === 0 ? light : lighter} />)
			}
		}
		return grooves
	}

	// Function: takes a hex code and lightens or darkens it
	// OG: https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
	const adjustColour = (colour: string, amount: number) => {
		return (
			'#' +
			colour
				.replace(/^#/, '')
				.replace(/../g, (colour) =>
					('0' + Math.min(255, Math.max(0, parseInt(colour, 16) + amount)).toString(16)).substr(-2)
				)
		)
	}

	// Groove colours
	const light = adjustColour(colour, 20)
	const lighter = adjustColour(colour, 35)

	return (
		<svg viewBox="0 0 100 100">
			<defs>
				<radialGradient id="inner-gap" cx="0.5" cy="0.5" r="0.7" fx="0.6" fy="0.5">
					<stop offset="0%" stopColor="white" />
					<stop offset="50%" stopColor="white" />
					<stop offset="98%" stopColor="rgba(0,0,0,0.6)" />
					<stop offset="99%" stopColor={colour} />
				</radialGradient>

				<radialGradient id={`grooves-${slug}`} cx="0.5" cy="0.5" r="0.7" fx="0.5" fy="0.5">
					<stop offset="0%" stopColor="#1a1a1a" />
					{/* 2 A-Side tracks */}
					{trackCount <= 2 && generateGrooves(35, 72, [54])}
					{/* 3 A-Side tracks */}
					{trackCount === 3 && generateGrooves(35, 72, [48, 62])}
					{/* 4 A-Side tracks */}
					{trackCount === 4 && generateGrooves(35, 72, [44, 54, 64])}
					{/* 5+ A-Side tracks */}
					{trackCount > 4 && generateGrooves(35, 72, [42, 50, 58, 66])}
				</radialGradient>

				<pattern id={`pattern-${slug}`} patternUnits="userSpaceOnUse" width="100" height="100">
					<image href={cover} x="32" y="32" height="36" width="36" />
				</pattern>
			</defs>
			<circle cx="50" cy="50" r="45" fill={colour} />
			{/* slug used to create a uid so that multiple can appear on same page */}
			<circle cx="50" cy="50" r="41" fill={`url(#grooves-${slug})`} />
			<circle cx="50" cy="50" r="21" fill={colour} />
			{/* slug used to create a uid so that multiple can appear on same page */}
			<circle cx="50" cy="50" r="18" fill={`url(#pattern-${slug})`} />
			<circle cx="50" cy="50" r="4" fill="url(#inner-gap)" />
		</svg>
	)
}

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

	return (
		<article>
			<Cover>
				<img src={record.cover.src} alt={`Cover art: ${record.cover.desc}`} />
				{record.medium === 'vinyl' && (
					<Vinyl slug={record.slug} cover={record.cover.src} trackCount={aSide} colour={colour} />
				)}
			</Cover>
			<h2>{record.title}</h2>
			<h3>{record.artist}</h3>
		</article>
	)
}

export type RecordAPI = {
	id: number
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
