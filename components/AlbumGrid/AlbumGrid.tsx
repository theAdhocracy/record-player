import React from 'react'
import styled from 'styled-components'
import { Album, RecordAPI } from '@components/Album/Album'

const GridWrapper = styled.section`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
	grid-template-rows: min-content min-content 1fr;
	gap: 3rem clamp(3rem, 4.5rem, 6rem);
`

export const AlbumGrid = ({ albums }: AlbumGridTypes) => {
	return (
		<GridWrapper>
			{albums.map((album) => {
				return <Album key={album.id} record={album} />
			})}
		</GridWrapper>
	)
}

type AlbumGridTypes = {
	albums: RecordAPI[]
}
