# Ad Hoc Record Player

My personal music collection, now in a digital flavour.

## To Do

- Generate splatter effect for records
- Add `h-card` to link
- Create main header image
- Consider microformats feed
- Scrobble button
- Record needle (?)
- Desired page
- Create CD image
- Add iconography for other tags (next to button?)
- Image optimisations
  - Maybe serve webp if able
- Pagination for home page
- Lazy loading
- Abstract `sort by` functionality into web component so that React can be removed from page
- Highlight most recent somehow
  - Could use a combination of `grid-column: span 2` to make them visually larger and then `grid-auto-flow: dense` to fill the gaps
  - Or leave the gaps and work out some way to fill them, maybe with music notes?
- Auto colour contrast record colours
- Allow people to like specific albums/artists
- Gather general webmentions of the site (maybe store on a hidden page? Or add to footer)
- Add Last.fm link and anything else relevant to the footer

- ✅ Display other albums by an artist on the artist page
- ✅ 404 page
- ✅ Loading page
- ✅ Sort by artist as default
- ✅ Sort by switches (artist or date purchased)
- ✅ Hide sort by if JS is not enabled
- ✅ Store sort choice in local storage
- ✅ Fix build to stop unwanted artist pages being rendered (`getStaticPaths`)

## Future

- Discogs integration
- Spotify integration
- Last.fm integration (full)
- Add awards
  - Top 10 per year (permanent)
  - Top 10 current (updated whenever)
  - Has been top 10 at some point (permanent)
  - Awards page with rankings and stats
