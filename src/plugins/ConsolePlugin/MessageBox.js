import React from 'react'
import PropTypes from 'prop-types'
import isObject from 'lodash.isobject'
import isArray from 'lodash.isarray'
import isBoolan from 'lodash.isboolean'
import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'
import isNull from 'lodash.isnull'
import isUndefined from 'lodash.isundefined'
import './MessageBox.css'
import TextBlock from './TextBlock'

/**
 * Display a message which may includes one line or multi-line
 */
export default class MessageBox extends React.Component {
  static PropTypes = {
    message: PropTypes.shape({
      id: PropTypes.string,
      level: PropTypes.oneOf(['log', 'warn', 'info', 'error', 'debug']),
      texts: PropTypes.arrayOf(PropTypes.any),
      timestamp: PropTypes.number
    })
  }

  formatDate (timestamp) {
    const align = (input, length = 2) => {
      input = String(input)
      if (input.length < length) {
        return '0'.repeat(length - input.length) + input
      } else {
        return input
      }
    }
    const d = new Date(timestamp)
    return align(d.getHours()) + ':' + align(d.getMinutes()) + ':' + align(d.getSeconds()) + '.' + align(d.getMilliseconds(), 3)
  }

  cutLongText (text, type) {
    const maxLen = 10
    let suffix = ''
    switch (type) {
      case 'object':
        suffix = '}'
        break
      case 'array':
        suffix = ']'
        break
      default:
        suffix = ''
        break
    }
    if (text.length <= maxLen) {
      return text
    } else {
      return text.substr(0, maxLen) + '...' + suffix
    }
  }

  renderTextBlock (input, meta = {}) {
    const {sumary = true} = meta
    switch (true) {
      case isString(input):
      case isNumber(input):
      case isNull(input):
      case isUndefined(input):
      case isBoolan(input):
        return (
          <span className='MessageBox-text-block'>
            &nbsp;{String(input)}
          </span>
        )
      case isObject(input):
        if (sumary) {
          return (
            <span className='MessageBox-text-block MessageBox-text-block--vertical'>
              <span>{JSON.stringify(input)}</span>
              <span>{this.renderTextBlock(input, { sumary: false })}</span>
            </span>
          )
        } else {
          return (
            <span className='MessageBox-text-block MessageBox-text-block--vertical MessageBox-text-block--intend'>
              {Object.keys(input).map(key => {
                const value = input[key]
                return (
                  <span key={key} className='MessageBox-text-block'>
                    <span>{key}</span>
                    :
                   <span>{this.renderTextBlock(value, { sumary: true })}</span>
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

  render () {
    const {
      message: { level, texts, timestamp }
    } = this.props
    return (
      <div className={`MessageBox MessageBox--${level}`}>
        <span className='MessageBox__item MessageBox__item--timestamp'>
          {this.formatDate(timestamp)}
        </span>
        {texts.map((value, index) =>
          <div key={index} className='MessageBox__item'>
            <TextBlock value={value} />
          </div>
        )}
      </div>
    )
  }
}
