import React from 'react'
import PropTypes from 'prop-types'
import isObject from 'lodash.isobject'
import isArray from 'lodash.isarray'
import isBoolan from 'lodash.isboolean'
import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'
import isNull from 'lodash.isnull'
import isUndefined from 'lodash.isundefined'
import './TextBlock.css'

export default class TextBlock extends React.Component {
  static PropTypes = {
    name: PropTypes.string,
    value: PropTypes.any.isRequired,
    indentSize: PropTypes.number
  }

  static defaultProps = {
    name: '',
    indentSize: 0
    // If current block display as a summary message or a detail list
    // isSummary: true,
    // If current <TextBlock> is the root block
    // isRoot: true
  }

  constructor () {
    super(...arguments)
    this.state = {
      isFolded: true
    }
    this.toggleFoldStatus = this.toggleFoldStatus.bind(this)
  }

  toggleFoldStatus (event) {
    event.stopPropagation()
    this.setState({
      isFolded: !this.state.isFolded
    })
  }

  // e.g. [1, [2, 3], 4] --> [1, Array(2), 4]
  createArraySummary (input) {
    let r = input.reduce((r, value) => {
      return r + `${this.createSummary(value, false, false)}, `
    }, '')
    r = r.substring(0, r.length - 2)  // remove last comma and space
    return `[${r}]`
  }

  // e.g. {a: 1, b: {c: 1}, d: 3} --> {a: 1, b: {...}, d: 3}
  createObjectSummary (input) {
    let r = Object.keys(input).reduce((r, key) => {
      const value = input[key]
      return r + `${key}: ${this.createSummary(value, false, false)}, `
    }, '')
    // remove last comma and space
    r = r.substring(0, r.length - 2)
    return `{${r}}`
  }

  /**
   * Create summary of the input value based on value type and the current status of TextBlock
   * @param {any} input
   * @param {boolean} isFolded
   * @param {boolean} isRoot
   */
  createSummary (input, isFolded = true, isRoot = true) {
    if (isString(input)) {
      return `"${input}"`
    } else if (isNumber(input)) {
      return String(input)
    } else if (isBoolan(input)) {
      return String(input)
    } else if (isNull(input)) {
      return String(input)
    } else if (isUndefined(input)) {
      return String(input)
    } else if (typeof input === 'function') {
      // TODO:
      // 1. replace the first 'function' with 'f'
      // 2. use isFunction() to adjudge the function type
      return `"${String(input)}"`
    } else if (isArray(input)) {
      if (isRoot) {
        return this.createArraySummary(input)
      } else {
        if (isFolded) { // If array is foled, display a summary of array
          return this.createArraySummary(input)
        } else { // If array is unfoled, display the type and length of array
          return `Array(${input.length})`
        }
      }
    } else if (isObject(input)) {
      if (isRoot) {
        return this.createObjectSummary(input)
      } else {
        if (isFolded) { // If object is foled, display a summary of object
          return this.createObjectSummary(input)
        } else {  // If object is unfoled, display nothing
          return '{...}'
        }
      }
    } else {
      return String(input)
    }
  }

  render () {
    const { name, value: input, indentSize } = this.props
    const { isFolded } = this.state

    switch (true) {
      case isString(input):
      case isNumber(input):
      case isNull(input):
      case isUndefined(input):
      case isBoolan(input):
        return (
          <span className='TextBlock'>
            {indentSize > 0 && <span className='TextBlock__indent'>{' '.repeat(indentSize)}</span>}
            {name && <span>{name}</span>}
            {name && <span>{': '}</span>}
            <span>{this.createSummary(input)}</span>
          </span>
        )
      case isObject(input):
        return (
          <span className='TextBlock TextBlock--vertical'>
            <span className='TextBlock'>
              {indentSize > 0 && <span className='TextBlock__indent'>{' '.repeat(indentSize)}</span>}
              {name && <span>{name}</span>}
              {name && <span>{': '}</span>}
              <span onClick={this.toggleFoldStatus}>{this.createSummary(input)}</span>
            </span>
            {!isFolded && Object.keys(input).map(key =>
              <TextBlock
                key={key}
                name={key}
                value={input[key]}
                indentSize={indentSize + 2}
              />
            )}
          </span>
        )
      default:
        return (
          <span className='TextBlock'>
            {indentSize > 0 && <span className='TextBlock__indent'>{' '.repeat(indentSize)}</span>}
            {name && <span>{name}</span>}
            {name && <span>{': '}</span>}
            <span>{String(input)}</span>
          </span>
        )
    }
  }
}
