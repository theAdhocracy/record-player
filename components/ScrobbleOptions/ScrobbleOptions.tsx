import React from 'react'
import { Side } from 'pages/[artist]/[album]'

const ScrobbleOptions = ({
	sides,
	callback
}: {
	sides: Side[]
	callback: React.Dispatch<React.SetStateAction<Record<string, unknown>>>
}) => {
	// Determine current date
	const currentDateTime = new Date()

	// Create current time object
	const hours = currentDateTime.getHours()
	const minutes = currentDateTime.getMinutes()
	const currentTime = {
		hour: hours,
		minute: minutes,
		twelveHour: hours > 12 ? hours - 12 : hours,
		// Get nearest quarter, rounding down so it never gives a future time
		quarter: minutes <= 14 ? 0 : minutes <= 29 ? 15 : minutes <= 44 ? 30 : 45
	}

	// Date array (within Last.fm limits of one month)
	const oneMonthAgo = new Date(Number(currentDateTime) - 1000 * 60 * 60 * 24 * 28) // converts ms to s, then days, then * 28 for minimum month
	const dateArray = []
	const dateToCheck = oneMonthAgo
	while (dateToCheck <= currentDateTime) {
		dateArray.push(new Date(dateToCheck))
		dateToCheck.setUTCDate(dateToCheck.getUTCDate() + 1)
	}
	dateArray.reverse() // puts it in most useful order

	// Create state object for side checkboxes
	const sidesObject: Record<string, boolean> = {}
	sides.map((side) => (sidesObject[side.side] = true))

	// Set initial state
	const [options, setOptions] = React.useState({
		hour: currentTime.twelveHour.toString(),
		quarter: currentTime.quarter.toString(),
		meridian: currentTime.hour <= 12 ? 'am' : 'pm',
		sides: sidesObject,
		date: dateArray[0].toDateString()
	})

	// console.log(options)

	// Trigger callback
	React.useEffect(() => {
		callback(options)
	}, [options])

	return (
		<section>
			<h3 className="sr-only">Choose side to scrobble:</h3>
			{sides.map((side) => {
				return (
					<React.Fragment key={side.side}>
						<label htmlFor={side.side.toLowerCase()}>Side {side.side}</label>
						<input
							type="checkbox"
							id={side.side.toLowerCase()}
							checked={options.sides[side.side]}
							onChange={(event) => {
								const newSides = options.sides
								newSides[side.side] = event.target.checked
								setOptions({ ...options, sides: newSides })
							}}
						/>
					</React.Fragment>
				)
			})}

			<fieldset>
				<legend>Start Time:</legend>
				<label htmlFor="time-hour" className="sr-only">
					Set hour
				</label>
				<select
					id="time-hour"
					value={options.hour}
					onChange={(event) => setOptions({ ...options, hour: event.target.value })}
				>
					<option value="1">01</option>
					<option value="2">02</option>
					<option value="3">03</option>
					<option value="4">04</option>
					<option value="5">05</option>
					<option value="6">06</option>
					<option value="7">07</option>
					<option value="8">08</option>
					<option value="9">09</option>
					<option value="10">10</option>
					<option value="11">11</option>
					<option value="12">12</option>
				</select>
				<label htmlFor="time-minute" className="sr-only">
					Set minutes
				</label>
				<select
					id="time-minute"
					value={options.quarter}
					onChange={(event) => setOptions({ ...options, quarter: event.target.value })}
				>
					<option value="0">00</option>
					<option value="15">15</option>
					<option value="30">30</option>
					<option value="45">45</option>
				</select>
				<label htmlFor="time-meridian" className="sr-only">
					Set meridian
				</label>
				<select
					id="time-meridian"
					value={options.meridian}
					onChange={(event) => setOptions({ ...options, meridian: event.target.value })}
				>
					<option value="am">AM</option>
					<option value="pm">PM</option>
				</select>
			</fieldset>

			<label htmlFor="start-date">Start date:</label>
			<select
				id="start-date"
				value={options.date}
				onChange={(event) => setOptions({ ...options, date: event.target.value })}
			>
				{dateArray.map((date, index) => {
					return (
						<option key={index} value={date.toDateString()}>
							{date.toDateString().replace(/ [0-9][0-9][0-9][0-9]$/, '')}
						</option>
					)
				})}
			</select>
		</section>
	)
}

export default ScrobbleOptions
