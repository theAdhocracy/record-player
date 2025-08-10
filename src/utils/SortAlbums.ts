// Function: sort album grid based on toggle state
export function sortAlbumGrid(sort: string) {
	const albumGrid = document.querySelector('.album-grid')
	const albums = albumGrid?.querySelectorAll('article')

	if (albums && albumGrid) {
		const sortedAlbums = [...albums].sort((a, b) => {
			const aRank = a.getAttribute(`data-${sort}-rank`) || 0
			const bRank = b.getAttribute(`data-${sort}-rank`) || 0
			return Number(aRank) - Number(bRank)
		})

		// Overwrite the existing HTML with sorted albums
		albumGrid.innerHTML = sortedAlbums.map((album) => album.outerHTML).join('')

		// Remove aria-busy attribute
		albumGrid.removeAttribute('aria-busy')
	}
}
