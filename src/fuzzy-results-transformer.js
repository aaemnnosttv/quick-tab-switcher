import assign from 'lodash/assign'
import keyBy from 'lodash/keyBy'
import map from 'lodash/map'
import mapValues from 'lodash/mapValues'

function highlightMatches(match, before, after) {
  const source = match.value
  let lastIdx = 0
  let newValue = ''

  match.indices.forEach(range => {
    const start = range[0]
    const end = range[1] + 1

    newValue += source.substring(lastIdx, start)
    newValue += `${before}${source.substring(start, end)}${after}`
    lastIdx = end
  })

  if (lastIdx < source.length) {
    newValue += source.substring(lastIdx)
  }

  return newValue
}

export default function(results, before, after) {
  if ('object' !== typeof results) {
    return results
  }

  return map(results, result => {
    const keyedResults = keyBy(result.matches, 'key');
    const highlighted = mapValues(keyedResults, matches => highlightMatches(matches, before, after))

    return assign({}, result.item, highlighted)
  })
}
