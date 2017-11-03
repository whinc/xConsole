/**
 * A collection of utils methods
 * Created by whincwu on 2017/11/3
 */

export const isFunction = v => typeof v === 'function'
export const isString = v => typeof v === 'string'
export const isNumber = v => typeof v === 'number'
export const isNull = v => v === null
export const isUndefined = v => v === undefined
export const isSymbol = v => typeof v === 'symbol'
export const isObject = v => v !== null && typeof v === 'object'

/**
 * generate an uuid
 * @returns string
 */
export const uuid = () => {
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return id
}
