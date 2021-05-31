# Ad Hoc Record Player

My personal music collection, now in a digital flavour.

## To Do

- Generate splatter effect for records
- Add `h-card` to link
- Create main header image
- Consider microformats feed
- Scrobble button
- ✅ Display other albums by an artist on the artist page
- Record needle (?)
- Desired page
- Create CD image
- Add iconography for other tags (next to button?)
- ✅ 404 page
- ✅ Loading page
- Image optimisations
  - Maybe serve webp if able
- Pagination for home page
- Lazy loading
- ✅ Sort by artist
- ✅ Sort by switches (artist or date purchased)
- ✅ Store sort choice in local storage
- Abstract `sort by` functionality into web component so that React can be removed from page
- ✅ Hide sort by if JS is not enabled
- Highlight most recent somehow
  - Could use a combination of `grid-column: span 2` to make them visually larger and then `grid-auto-flow: dense` to fill the gaps
  - Or leave the gaps and work out some way to fill them, maybe with music notes?
- Auto colour contrast record colours
- ✅ Fix build to stop unwanted artist pages being rendered (`getStaticPaths`)

## Future

- Discogs integration
- Spotify integration
- Last.fm integration (full)
