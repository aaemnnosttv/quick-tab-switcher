import Fuse from 'fuse.js'
import assign from 'lodash/assign'

const defaults = {
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1
}

export default function(list, needle, options = {}) {
  const fuse = new Fuse(list, assign({}, defaults, options))

  return fuse.search(needle)
}
