import React from 'react'
import styled from 'styled-components'
import Page from '@components/Page/Page'
import Vinyl from '@components/Vinyl/Vinyl'

const Wrapper = styled(Page)`
	main {
		display: flex;
		flex-direction: column;
		place-content: center;
		place-items: center;
		padding: 1rem;

		h1 {
			text-align: center;
		}
	}
`

const LoadingRecord = styled.div`
	height: 10rem;
	width: 10rem;
`

export const Loading = ({ children }: { children?: React.ReactNode }) => {
	return (
		<Wrapper>
			<h1>Spinning Up Your Selection</h1>
			<LoadingRecord>
				<Vinyl
					cover={
						'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><clipPath id="half"><rect x="0" y="0" width="55" height="100" /></clipPath><clipPath id="quarter"><rect x="50" y="50" width="50" height="50" /><rect x="0" y="0" width="50" height="100" /></clipPath><circle cx="50" cy="50" r="30" stroke="orange" fill="none" stroke-width="5px" clip-path="url(%23half)" /><circle cx="50" cy="50" r="30" stroke="orange" stroke-dasharray="5, 5" fill="none" stroke-width="5px" clip-path="url(%23quarter)" /></svg>'
					}
					slug="loading"
					trackCount={3}
					colour="#000000"
					isRotating={true}
				/>
			</LoadingRecord>
			{children}
		</Wrapper>
	)
}

export default Loading
