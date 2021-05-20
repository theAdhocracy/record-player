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

	header,
	footer,
	main {
		width: 100%;
	}
`

export const Page = ({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<Wrapper className={className}>
			<header>{/* Add nav and record image here */}</header>
			<main>{children}</main>
			<Footer />
		</Wrapper>
	)
}

export default Page
