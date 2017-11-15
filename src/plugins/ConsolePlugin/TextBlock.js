import React from 'react'
import PropTypes from 'prop-types'
import isObject from 'lodash.isobject'
// import isArray from 'lodash.isarray'
import isBoolan from 'lodash.isboolean'
import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'
import isNull from 'lodash.isnull'
import isUndefined from 'lodash.isundefined'
import './TextBlock.css'

export default class TextBlock extends React.Component {
  static PropTypes = {
    value: PropTypes.any.isRequired,
    sumary: PropTypes.bool
  }

  static defaultProps = {
    sumary: true
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

  render () {
    const {value: input, sumary} = this.props
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
         * 1. show one line sumary
         * 2. show mutil-lines, each line display a key-value propperty of the input
         *
         * AAAA (sumary === true)
         *
         * AAAA (sumary === false)
         *   BB: CC
         *   DD: EE
         */
        if (sumary) {
          return (
            <span className='TextBlock TextBlock--vertical'>
              <span onClick={this.toggleFoldStatus}>{JSON.stringify(input)}</span>
              <span>
                {isFolded ? null : <TextBlock value={input} sumary={false} /> }
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
                      <TextBlock value={input[key]} sumary />
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
