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
import isSymbol from 'lodash.issymbol'
import './TextInlineBlock.css'

export default class TextInlineBlock extends React.Component {
  static PropTypes = {
    name: PropTypes.string,
    value: PropTypes.any.isRequired,
    /**
     * the depth bigger the value information is the more detailed
     *  0: show the type.
     *  1: show the property of the value
     * -1: show the proprty of the value recursionly
     *
     * For example, the value is {a: 1, b: {c: 2}, [1, 2]}
     * show 'Object' when depth is 0
     * show '{a: 1, b: {...}, Array(2)}' when depth is 1
     * show '{a: 1, b: {c: 2}, [1, 2]}' when depth is -1
     */
    depth: PropTypes.number,
    isFolded: PropTypes.boolean
  }

  static defaultProps = {
    name: '',
    depth: 1,
    isFolded: true
  }

  render () {
    const {name, value, depth} = this.props

    let element = null

    if (isString(value)) {
      // if name is empty the value display in log message
      // else the value display in object which need wrapped with double quote
      if (depth !== 0) {
        element = <span className='TextInlineBlock__value--string'>"{value}"</span>
      } else {
        element = <span>{value}</span>
      }
    } else if (isNumber(value)) {
      element = <span className='TextInlineBlock__value--number'>{String(value)}</span>
    } else if (isBoolan(value)) {
      element = <span className='TextInlineBlock__value--boolean'>{String(value)}</span>
    } else if (isNull(value)) {
      element = <span className='TextInlineBlock__value--null'>{String(value)}</span>
    } else if (isUndefined(value)) {
      element = <span className='TextInlineBlock__value--undefined'>{String(value)}</span>
    } else if (isSymbol(value)) {
      element = <span className='TextInlineBlock__value--symbol'>{String(value)}</span>
    } else if (isFunction(value)) {
      let summary = String(value).replace(/function/, 'f')
      if (name) { // hide the function body when function appear in object key-value
        summary = summary.replace(/{.*}/, '')
      }
      element = <span>{summary}</span>
    } else if (isArray(value)) {
      if (depth !== 0) {
        element = (
          <span>
            [{value.map((v, index) =>
              <span key={index}>
                <TextInlineBlock key={index} value={v} depth={depth - 1} />
                <span>{index !== value.length - 1 ? ', ' : ''}</span>
              </span>
            )}]
          </span>
        )
      } else {
        element = <span>Array({value.length})</span>
      }
    } else if (isObject(value)) {
      if (depth !== 0) {
        const keys = Object.keys(value)
        element = (
          <span>
            [{keys.map((k, index) =>
              <span key={k}>
                <span className='TextInlineBlock__name'>{k}</span>
                <span className='TextInlineBlock__separator'>:</span>
                <TextInlineBlock name={k} value={value[k]} depth={depth - 1} />
                <span>{index !== keys.length - 1 ? ', ' : ''}</span>
              </span>
            )}]
          </span>
        )
      } else {
        element = <span>Object</span>
      }
    } else {
      element = <span>String(value)</span>
    }

    return <span className='TextInlineBlock'>{element}</span>
  }
}
