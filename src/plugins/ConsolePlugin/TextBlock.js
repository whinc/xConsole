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
    value: PropTypes.any.isRequired,
    isSummary: PropTypes.bool,
    isRoot: PropTypes.bool
  }

  static defaultProps = {
    // If current block display as a summary message or a detail list
    isSummary: true,
    // If current <TextBlock> is the root block
    isRoot: true
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

  createArraySummary (input) {
    let r = input.reduce((r, value) => {
      return r + `${this.createSummary(value, false, false)}, `
    }, '')
    r = r.substring(0, r.length - 2)  // remove last comma and space
    return `[${r}]`
  }

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
   * Create summary of the input value based on it's type, foled status and is root
   * @param {any} input
   * @param {boolean} isFolded
   * @param {boolean} isRoot
   */
  createSummary (input, isFolded = true, isRoot = true) {
    if (isArray(input)) {
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
    const {value: input, isSummary, isRoot} = this.props
    const {isFolded} = this.state

    switch (true) {
      case isString(input):
      case isNumber(input):
      case isNull(input):
      case isUndefined(input):
      case isBoolan(input):
        return (
          <span className='TextBlock'>
            &nbsp;{String(input)}
          </span>
        )
      case isObject(input):
        /*
         * If input is 'object' it can display with two mode:
         * 1. show one line summary
         * 2. show mutil-lines, each line display a key-value propperty of the input
         *
         * AAAA (summary === true)
         *
         * AAAA (summary === false)
         *   BB: CC
         *   DD: EE
         */
        if (isSummary) {
          return (
            <span className='TextBlock TextBlock--vertical'>
              <span onClick={this.toggleFoldStatus}>&nbsp;{this.createSummary(input, isFolded, isRoot)}</span>
              <span>
                {!isFolded && <TextBlock value={input} isSummary={false} isRoot={false} /> }
              </span>
            </span>
          )
        } else {
          return (
            <span className='TextBlock TextBlock--vertical TextBlock--intend'>
              {Object.keys(input).map(key => {
                return (
                  <span key={key} className='TextBlock'>
                    <span>{key}</span>
                    <span>:</span>
                    <span>
                      <TextBlock value={input[key]} isSummary isRoot={false} />
                    </span>
                  </span>
                )
              }
              )}
            </span>
          )
        }
      default:
        return null
    }
  }
}
