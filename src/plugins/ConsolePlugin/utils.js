import isString from 'lodash.isstring'

/**
 * return wrapped code which will be executed in sandbox when invoded by 'eval()'
 * @param {string} [code='']
 * @param {object} [sandbox={}]
 */
export function withSandbox (code = '', sandbox = {}) {
  if (!isString(code)) return ''

  const newCode = `
  (function (){
    ${Object.keys(sandbox).reduce((r, key) => `${r}var ${key} = sandbox.${key}; `, '')}
    return eval("${code}")
  }).call(${JSON.stringify(sandbox)})
  `
  return newCode
}
