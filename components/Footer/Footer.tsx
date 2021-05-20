import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.footer`
	display: flex;
	place-content: center;
	place-items: center;
	min-height: 5rem;
	margin-top: 3rem;
	background-color: #2c2727;
	color: #ffffff;
	text-align: center;
`

export const Footer = () => {
	return (
		<StyledFooter>
			<p>Powered by 🎼</p>
		</StyledFooter>
	)
}
