import React from 'react'
import styled from 'styled-components'
import Page from '@components/Page/Page'

const Wrapper = styled(Page)`
	main {
		display: flex;
		flex-direction: column;
		place-content: center;
		place-items: center;
		padding: 1rem;
	}
`

export const Error404 = ({ children }: { children?: React.ReactNode }) => {
	return (
		<Wrapper>
			<h1>Record Skip: 404</h1>
			<p>It looks like you've tried to reach a page which doesn't exist, sorry 😔</p>
			{children}
		</Wrapper>
	)
}

export default Error404
