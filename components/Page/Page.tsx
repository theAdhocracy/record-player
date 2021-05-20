import React from 'react'
import styled from 'styled-components'
import { Footer } from '../Footer/Footer'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	main {
		flex: 1;
	}
`

const Main = styled.main`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: min-content min-content 1fr;
	gap: 1rem 6rem;
	max-width: 100rem;
	margin: 0 auto;

	h1,
	p {
		grid-column: 1 / -1;
		text-align: center;
	}

	h1 {
		margin-bottom: 0;
	}

	p {
		margin: 1rem 0 3rem;
	}
`

export const Page = ({ children }: { children: React.ReactNode }) => {
	return (
		<Wrapper>
			<header>{/* Add nav and record image here */}</header>

			<Main>{children}</Main>

			<Footer />
		</Wrapper>
	)
}

export default Page
