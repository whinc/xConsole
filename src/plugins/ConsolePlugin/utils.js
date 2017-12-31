import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'

/**
 * return formated string
 * reference to <https://developers.google.cn/web/tools/chrome-devtools/console/console-write#string_substitution_and_formatting>
 * usage example:
 * format('%s + %s = %s', 1, 2, 1 + 2)  // return ['1 + 2 = 3']
 */
export function format () {
  const r = _format(...arguments)
  // concat continuous string
  return r.reduce((pre, cur, index) => {
    if (isString(pre[pre.length - 1]) && isString(cur)) {
      pre.push(pre.pop() + cur)
    } else {
      pre.push(cur)
    }
    return pre
  }, [])
}

/**
 * return fomated string recursively
 * @param {Array<any>} args
 *
 * Illustration to the impletation algorightm
 * format('%s %s a', 1, 2)
 * --> ['1', ...format('%s a', 2)]
 * --> ['1', '2', ...format('a')]
 * --> ['1', '2', 'a']
 */
function _format (f) {
  if (!isString(f)) {
    return arguments.length === 0 ? [] : [...arguments]
  }

  const [, ...args] = arguments
  const matcher = /(%s|%o|%O|%i|%d|%f)/
  const result = matcher.exec(f)
  // no format specifier
  if (!result) {
    return [...arguments]
  }

  const {0: specifier, index: pos} = result
  const r = []
  if (pos > 0) {
    r.push(f.substring(0, pos))
  }
  if (args.length > 0) {
    const replacer = args.shift()
    if (specifier === '%s') {
      r.push(String(replacer))
    } else if (specifier === '%i' || specifier === '%d') {
      if (isNumber(replacer)) {
        r.push(parseInt(replacer))
      } else {
        r.push(NaN)
      }
    } else {
      r.push(replacer)
    }
  }

  // move to next start position in format string
  const nextPos = pos + '%s'.length
  if (nextPos < f.length) {
    const f2 = f.substring(nextPos)
    if (args.length > 0) {
      r.push(..._format(f2, ...args))
    } else {
      r.push(f2)
    }
  } else {
    if (args.length > 0) {
      r.push(...args)
    }
  }

  return r
}
