import React from 'react'

export const Record = ({ artist }: RecordTypes) => {
	return <h2>{artist}</h2>
}

export default Record

type RecordTypes = {
	artist: string
}
