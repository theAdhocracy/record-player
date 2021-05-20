import React from 'react'
import Head from 'next/head'
import { Album, RecordAPI } from '../components/Album/Album'
import Page from '../components/Page/Page'

export default function Home({ records }: HomeTypes): JSX.Element {
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
			<Page>
				<h1>Welcome to the Hall of Records</h1>
				<p>
					You've stumbled into the personal record collection of{' '}
					<a href="https://theadhocracy.co.uk/">@theAdhocracy</a> – feel free to take a look around!
				</p>
				{records.map((record) => {
					return <Album key={record.id} record={record} />
				})}
			</Page>
		</>
	)
}

type HomeTypes = {
	records: RecordAPI[]
}

export async function getStaticProps() {
	// Fetch records
	const res = await fetch('https://cms.theadhocracy.co.uk/music.json')
	const records = await res.json()

	return {
		props: {
			records: records.data
		}
	}
}
