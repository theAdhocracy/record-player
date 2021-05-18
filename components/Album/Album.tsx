import React from 'react'
import styled from 'styled-components'

const Cover = styled.div`
	position: relative;
	height: 20rem;
	width: 20rem;

	img {
		z-index: 1;
		border: 8px solid #ececec;
		border-radius: 12px;
		max-width: 20rem;
		transition: transform 0.8s ease-in-out;
		box-shadow: 6px 0 15px -12px rgba(0, 0, 0, 0.6);

		:hover {
			transform: translateX(-4rem);

			& + svg {
				transform: translateX(7rem) rotate(45deg);
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

export const Album = ({ record }: AlbumTypes): JSX.Element => {
	const generateGrooves = (start: number, end: number) => {
		const grooves = []
		for (let i = start; i <= end; i++) {
			grooves.push(<stop offset={`${i}%`} stopColor={i % 2 === 0 ? '#131313' : '#1a1a1a'} />)
		}
		return grooves
	}

	return (
		<>
			<Cover>
				<img src={record.cover.src} alt={`Cover art: ${record.cover.desc}`} />
				<svg viewBox="0 0 100 100">
					<defs>
						<radialGradient id="inner-gap" cx="0.5" cy="0.5" r="0.7" fx="0.6" fy="0.5">
							<stop offset="0%" stopColor="white" />
							<stop offset="50%" stopColor="white" />
							<stop offset="98%" stopColor="rgba(0,0,0,0.6)" />
							<stop offset="99%" stopColor="#000000" />
						</radialGradient>

						<radialGradient id="grooves" cx="0.5" cy="0.5" r="0.7" fx="0.5" fy="0.5">
							<stop offset="0%" stopColor="#1a1a1a" />
							{generateGrooves(35, 47)}
							{/* inner track */}
							<stop offset="48%" stopColor="#000000" />
							{generateGrooves(49, 61)}
							{/* mid track */}
							<stop offset="62%" stopColor="#000000" />
							{generateGrooves(63, 72)}
						</radialGradient>

						<pattern
							id={`pattern-${record.slug}`}
							patternUnits="userSpaceOnUse"
							width="100"
							height="100"
						>
							<image href={record.cover.src} x="32" y="32" height="36" width="36" />
						</pattern>
					</defs>
					<circle cx="50" cy="50" r="45" fill="black" />
					<circle cx="50" cy="50" r="41" fill="url(#grooves)" />
					<circle cx="50" cy="50" r="21" fill="black" />
					<circle cx="50" cy="50" r="18" fill={`url(#pattern-${record.slug})`} />
					<circle cx="50" cy="50" r="4" fill="url(#inner-gap)" />
				</svg>
			</Cover>
			<h2>{record.title}</h2>
			<h3>{record.artist}</h3>
		</>
	)
}

type AlbumTypes = {
	record: {
		id: number
		title: string
		slug: string
		date: string
		updated: string
		artist: string
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
}
