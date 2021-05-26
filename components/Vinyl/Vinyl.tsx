import React from 'react'
import styled from 'styled-components'
import { adjustColour } from '@utils/ColourAdjust'

const SVG = styled.svg`
	@media (prefers-reduced-motion: no-preference) {
		& .platter {
			animation: rotation 2.5s infinite linear;
			animation-play-state: paused;
			transform-origin: center;

			&.rotate,
			&:hover {
				animation-play-state: running;
			}
		}
	}

	@keyframes rotation {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(359deg);
		}
	}
`

export const Vinyl = ({ cover, slug, trackCount, colour, isRotating = false }: VinylProps) => {
	// Function: takes the start and end points, returns alternating concentric circles as a gradient; tracks value determines which should be black
	const generateGrooves = (start: number, end: number, tracks: number[]) => {
		const grooves = []

		for (let i = start; i <= end; i++) {
			if (tracks.includes(i)) {
				grooves.push(<stop offset={`${i}%`} stopColor={colour} key={`track-${i}`} />)
			} else {
				grooves.push(
					<stop offset={`${i}%`} stopColor={i % 2 === 0 ? light : lighter} key={`groove-${i}`} />
				)
			}
		}
		return grooves
	}

	// Groove colours
	const light = adjustColour(colour, 20)
	const lighter = adjustColour(colour, 35)

	return (
		<SVG viewBox="0 0 100 100">
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
			<g className={isRotating ? 'platter rotate' : 'platter'}>
				<circle cx="50" cy="50" r="45" fill={colour} />
				{/* slug used to create a uid so that multiple can appear on same page */}
				<circle cx="50" cy="50" r="41" fill={`url(#grooves-${slug})`} />
				<circle cx="50" cy="50" r="21" fill={colour} />
				{/* slug used to create a uid so that multiple can appear on same page */}
				<circle cx="50" cy="50" r="18" fill={`url(#pattern-${slug})`} />
				<circle cx="50" cy="50" r="4" fill="url(#inner-gap)" />
			</g>
		</SVG>
	)
}

export default Vinyl

type VinylProps = {
	cover: string
	slug: string
	trackCount: number
	colour: string
	isRotating?: boolean
}
