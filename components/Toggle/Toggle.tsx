import Vinyl from '@components/Vinyl/Vinyl'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.label`
	display: grid;
	grid-template-columns: 1fr 2fr 1fr;
	width: max-content;
	place-content: center;
	place-items: center;
	margin: 0 auto 1rem;
	flex-direction: column;

	span {
		font-style: italic;
		color: #00000066;
		transition: color 0.75s ease-in;
	}

	span:first-child {
		grid-column: 1 / -1;
		opacity: 0;
		transition: opacity 0.75s ease-in;
		align-self: end;
	}

	:hover,
	:focus-within {
		& > span:first-child {
			opacity: 1;
		}

		span:not(:first-child) {
			color: #354797;
		}
	}

	&.left:hover,
	&.left:focus-within {
		& > span:first-child {
			opacity: 1;
		}

		span:not(:first-child) {
			color: #f16e26;
		}

		div {
			border-color: #f16e26;
		}
	}

	div,
	input {
		grid-column: 2;
		grid-row: 2;
	}

	input {
		width: 4.38rem;
		height: 2.4rem;
		opacity: 0.0001;
		cursor: pointer;
		z-index: 1;
	}

	div {
		display: flex;
		max-height: 3.4rem;
		width: 4.38rem;
		border: 3px solid #00000066;
		border-radius: 1.75rem;
		transition: transform 1s ease-in-out, border 0.5s ease-out;
		background-color: white;
	}

	input:hover + div,
	input:focus + div {
		border: 3px solid #354797;
		cursor: pointer;

		svg {
			filter: grayscale(0) hue-rotate(145deg) brightness(1.8);
			opacity: 1;
		}

		&.right svg {
			filter: grayscale(0);
		}
	}

	div.right {
		svg {
			transform: translateX(100%);
			filter: grayscale(1);
		}
	}

	svg {
		transition: transform 1s ease-in-out, filter 1s ease-out, opacity 1.2s ease-in;
		height: 2rem;
		filter: grayscale(1);
		opacity: 0.75;
	}
`

export const Toggle = ({ onChange }: ToggleTypes) => {
	const [toggle, setToggle] = React.useState(true)

	// Set toggle position based on localstorage sort value
	React.useLayoutEffect(() => {
		const sort = localStorage.getItem('sort')
		if (sort === 'date') setToggle(false)
	}, [])

	return (
		<Wrapper htmlFor="sort-toggle" className={toggle ? 'left' : 'right'}>
			<span>sort by</span>
			<span>a-z</span>
			<input
				id="sort-toggle"
				type="checkbox"
				onChange={() => {
					onChange()
					setToggle(!toggle)
				}}
			/>
			<div className={toggle ? 'left' : 'right'}>
				<Vinyl cover={''} slug="sort" trackCount={3} colour={'#354797'} />
			</div>
			<span>date</span>
		</Wrapper>
	)
}

export default Toggle

type ToggleTypes = {
	onChange: any
}
