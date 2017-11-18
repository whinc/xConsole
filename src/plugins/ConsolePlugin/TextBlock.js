import React from 'react'
import PropTypes from 'prop-types'
import isObject from 'lodash.isobject'
import isArray from 'lodash.isarray'
import isBoolan from 'lodash.isboolean'
import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'
import isNull from 'lodash.isnull'
import isUndefined from 'lodash.isundefined'
import isFunction from 'lodash.isfunction'
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

  /**
   * Create the summary of passed in value
   * @param {any} value passwd in value
   * @param {sting = ''} name the name of value
   * @param {boolean} isFolded the value whether folded or not
   */
  createSummary (value, name = '', isFolded = true) {
    if (isString(value)) {
      return `"${value}"`
    } else if (isNumber(value)) {
      return String(value)
    } else if (isBoolan(value)) {
      return String(value)
    } else if (isNull(value)) {
      return String(value)
    } else if (isUndefined(value)) {
      return String(value)
    } else if (isFunction(value)) {
      const summary = String(value).replace(/function/, 'f')
      return `${summary}`
    } else if (isArray(value)) {  // e.g. [1, [2, 3], 4] --> [1, Array(2), 4]
      if (!name || isFolded) {
        let summary = value.reduce((s, v, k) => {
          return s + `${this.createSummary(v, k, false)}, `
        }, '')
        // remove last comma and space
        summary = summary.substring(0, summary.length - 2)
        return `[${summary}]`
      } else {
        return `Array(${value.length})`
      }
    } else if (isObject(value)) { // e.g. {a: 1, b: {c: 1}, d: 3} --> {a: 1, b: {...}, d: 3}
      if (!name || isFolded) {
        let summary = Object.keys(value).reduce((s, k) => {
          const v = value[k]
          return s + `${k}: ${this.createSummary(v, k, false)}, `
        }, '')
        // remove last comma and space
        summary = summary.substring(0, summary.length - 2)
        return `{${summary}}`
      } else {
        return '{...}'
      }
    } else {
      return String(value)
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
            <span>{this.createSummary(input, name, true)}</span>
          </span>
        )
      case isObject(input):
        return (
          <span className='TextBlock TextBlock--vertical'>
            <span className='TextBlock'>
              {indentSize > 0 && <span className='TextBlock__indent'>{' '.repeat(indentSize)}</span>}
              {name && <span>{name}</span>}
              {name && <span>{': '}</span>}
              <span onClick={this.toggleFoldStatus}>{this.createSummary(input, name, isFolded)}</span>
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
