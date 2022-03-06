import Head from 'next/head'
import React from 'react'
import styled from 'styled-components'
import { Footer } from '../Footer/Footer'

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;

	main {
		flex: 1;
		overflow: hidden;
	}

	header,
	footer,
	main {
		width: 100%;
	}
`

const Nav = styled.nav`
	display: flex;
	place-content: center;
	place-items: center;

	ul {
		display: grid;
		grid-template-columns: 2fr max-content max-content max-content 2fr;
		gap: 1rem;
		width: 100%;
		list-style: none;
		padding: 0 2rem;
	}

	li {
		margin: 0;
		padding: 0;
	}

	@media screen and (min-width: 400px) {
		ul {
			gap: 2rem;
		}
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
		<>
			<Head>
				<title>Adhoc Records</title>
				<meta name="description" content="Personal record collection and jukebox" />
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💿</text></svg>"
				></link>
			</Head>
			<Wrapper className={className}>
				<header>
					<Nav>
						<ul>
							<li>
								<a href="https://theadhocracy.co.uk">theAdhocracy</a>
							</li>
							<li>
								<a href="/">Collection</a>
							</li>
							<li>💿</li>
							<li>
								<a href="/wanted">Desired</a>
							</li>
						</ul>
					</Nav>
				</header>
				<main>{children}</main>
				<Footer />
			</Wrapper>
		</>
	)
}

export default Page
