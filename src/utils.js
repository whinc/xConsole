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
