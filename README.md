# Ad Hoc Record Player

My personal music collection, now in a digital flavour.

## To Do

- Generate splatter effect for records
- Add `h-card` to link
- Create main header image
  - Will need a smaller version (simplified) for nav?
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
- RSS feed

- ✅ Display other albums by an artist on the artist page
- ✅ 404 page
- ✅ Loading page
- ✅ Sort by artist as default
- ✅ Sort by switches (artist or date purchased)
- ✅ Hide sort by if JS is not enabled
- ✅ Store sort choice in local storage
- ✅ Change sort so that it ignores "the" in titles
- ✅ Fix build to stop unwanted artist pages being rendered (`getStaticPaths`)

## Future

- Discogs integration
- Spotify integration
- Last.fm integration (full)
  - Pressing scrobble button should send preformatted API request directly to Last.fm
  - Will need to ensure that doing so only works if the user is logged in on local device, so that other people can't scrobble to my account 😂 (also means others can use my site to scrobble specific albums)
  - Perhaps some kind of additional keyboard combination (Shift + click?) first pops up a date entry to retroactively scrobble. For the most part unnecessary (don't care that much) but might be beneficial for some instances the cross month/**year** boundaries
  - Automate awards? (Probably too much effort - MTIH)
- Add awards
  - Top 10 per year (permanent)
  - Top 10 current (updated whenever)
  - Has been top 10 at some point (permanent)
  - Awards page with rankings and stats
  - Top artists all of the above
- Shops page
- Could set up a web ring of similar sites, then use webmentions to say "I own this too" as a way of interlinking? (<-- probably needs some kind of central db)
