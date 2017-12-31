import React from 'react'
import PropTypes from 'prop-types'
import isObject from 'lodash.isobject'
import isBoolan from 'lodash.isboolean'
import isString from 'lodash.isstring'
import isNumber from 'lodash.isnumber'
import isNull from 'lodash.isnull'
import isUndefined from 'lodash.isundefined'
import isFunction from 'lodash.isfunction'
import isSymbol from 'lodash.issymbol'
import './TextBlock.css'
import TextInlineBlock from './TextInlineBlock'
import ErrorBoundary from './ErrorBoundary'

const INDENT = 5

export default class TextBlock extends React.Component {
  static PropTypes = {
    name: PropTypes.string,
    nameType: PropTypes.oneOf(['private', 'public']),
    value: PropTypes.any.isRequired,
    indentSize: PropTypes.number
  }

  static defaultProps = {
    name: '',
    nameType: 'public',
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
  // createSummary (value, name = '', isFolded = true) {
  //   if (isString(value)) {
  //     // if name is empty the value display in log message
  //     // else the value display in object which need wrapped with double quote
  //     return name ? `"${value}"` : value
  //   } else if (isNumber(value)) {
  //     return String(value)
  //   } else if (isBoolan(value)) {
  //     return String(value)
  //   } else if (isNull(value)) {
  //     return String(value)
  //   } else if (isUndefined(value)) {
  //     return String(value)
  //   } else if (isSymbol(value)) {
  //     return String(value)
  //   } else if (isFunction(value)) {
  //     let summary = String(value).replace(/function/, 'f')
  //     if (name) { // hide the function body when function appear in object key-value
  //       summary = summary.replace(/{.*}/, '')
  //     }
  //     return `${summary}`
  //   } else if (isArray(value)) {
  //     /**
  //      * Show the summary of content when satisfy one of condition below:
  //      * a. display as a value
  //      * b. display as a value in array
  //      *
  //      * e.g. [1, [2, 3], 4] --> [1, Array(2), 4]
  //      */
  //     if (!name || (isFolded && value.length > 0)) {  // display as a value obj object
  //       let summary = value.reduce((s, v, k) => {
  //         return s + `${this.createSummary(v, k, false)}, `
  //       }, '')
  //       summary = summary.substring(0, summary.length - 2)
  //       return `[${summary}]`
  //     } else {
  //       return `Array(${value.length})`
  //     }
  //   } else if (isObject(value)) {
  //     /**
  //      * Show the summary of content when satisfy one of condition below:
  //      * a. display as a value
  //      * b. display as a value obj object
  //      *
  //      * e.g. {a: 1, b: {c: 1}, d: 3} --> {a: 1, b: {...}, d: 3}
  //      */
  //     if (!name || (isFolded && Object.keys(value).length > 0)) {
  //       let summary = Object.keys(value).reduce((s, k) => {
  //         const v = value[k]
  //         return s + `${k}: ${this.createSummary(v, k, false)}, `
  //       }, '')
  //       summary = summary.substring(0, summary.length - 2)
  //       return `{${summary}}`
  //     } else {
  //       return 'Object'
  //     }
  //   } else {
  //     return String(value)
  //   }
  // }

  // render each property of 'value' as a <TextBlock>
  renderChild (value, name, indentSize) {
    const keys = [...Object.getOwnPropertyNames(value)]
    const propsList = []
    let _indentSize = indentSize + 2

    keys.forEach((key, index) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      let _nameType = descriptor.enumerable ? 'public' : 'private'

      // descriptor.value may be undefined
      // descript.value and descriptor.get/set can not be existed simultaneously
      if ((descriptor.value !== undefined) ||
          (descriptor.get === undefined && descriptor.set === undefined)) {
        let _name = isString(key) ? key : String(key)
        let _value = descriptor.value
        propsList.push({
          name: _name,
          nameType: _nameType,
          value: _value,
          indentSize: _indentSize
        })
      } else {
        // TODO: need to lazy calculate
        let _name = isString(key) ? key : String(key)
        let _value
        try {
          // In strict mode, access to 'callee', 'caller' and 'arguments' may throw exception
          // capture this exception to avoid crash
          _value = descriptor.get()
        } catch (error) {
          _value = String(error)
        }
        propsList.push({
          name: _name,
          nameType: _nameType,
          value: _value,
          indentSize: _indentSize
        })

        if (isFunction(descriptor.get)) {
          let _name = isString(key) ? key : String(key)
          _name = `get ${_name}`
          let _value = descriptor.get
          propsList.push({
            name: _name,
            nameType: _nameType,
            value: _value,
            indentSize: _indentSize
          })
        }

        if (isFunction(descriptor.set)) {
          let _name = isString(key) ? key : String(key)
          _name = `set ${_name}`
          _value = descriptor.set
          propsList.push({
            name: _name,
            nameType: _nameType,
            value: _value,
            indentSize: _indentSize
          })
        }
      }
    })

    if (keys.indexOf('__proto__') === -1) {
      let _name = '__proto__'
      let _nameType = 'private'
      let _value = isFunction(Object.getPrototypeOf) ? Object.getPrototypeOf(value) : value[_name]
      propsList.push({
        name: _name,
        nameType: _nameType,
        value: _value,
        indentSize: _indentSize
      })
    }

    // sort function for keys
    const compareFn = (a, b) => {
      if (a.nameType === 'public' && b.nameType === 'public') {
        // sort by alphabetical order
        return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)
      } else if (a.nameType === 'public' && b.nameType === 'private') {
        return -1
      } else if (a.nameType === 'private' && b.nameType === 'public') {
        return 1
      } else {  // a.nameType === 'private' && b.nameType === 'private'
        if (a.name === '__proto__') {
          return 1
        } else if (b.name === '__proto__') {
          return -1
        } else {
          // sort by alphabetical order
          return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)
        }
      }
    }

    return propsList.sort(compareFn).map(props => <TextBlock key={props.name} {...props} />)
  }

  render () {
    const { name, nameType, value, indentSize } = this.props
    const { isFolded } = this.state

    const nameClass = nameType === 'private' ? 'TextBlock__name--private' : 'TextBlock__name'
    const valueClass = name ? `TextBlock__value--${typeof value}` : ''

    switch (true) {
      case isString(value):
      case isNumber(value):
      case isNull(value):
      case isUndefined(value):
      case isBoolan(value):
      case isSymbol(value):
        return (
          <span className='TextBlock'>
            <span style={{width: INDENT * indentSize}} />
            {name && <span className={nameClass}>{name}</span>}
            {name && <span className='TextBlock__separator'>{': '}</span>}
            <span className={valueClass}>
              {/* {this.createSummary(value, name, true)} */}
              <ErrorBoundary>
                <TextInlineBlock
                  name={name}
                  value={value}
                  depth={0}
                />
              </ErrorBoundary>
            </span>
          </span>
        )
      case isObject(value):
        const iconClass = isFolded ? 'fa fa-caret-down fa-rotate-270' : 'fa fa-caret-down'
        // if value is a object and display as root(which has no name), it should has a initial indent size for the icon
        const _indentSize = name ? indentSize : 2
        return (
          <span className='TextBlock TextBlock--vertical'>
            <span className='TextBlock' onClick={this.toggleFoldStatus}>
              {indentSize > 0 ? (
                <span className='TextBlock__indent' style={{width: INDENT * indentSize}}>
                  <span className={iconClass} style={{marginRight: 2}} />
                </span>
              ) : (
                <span className={iconClass} style={{marginRight: 2}} />
              )}
              {name && <span className={nameClass}>{name}</span>}
              {name && <span className='TextBlock__separator'>{': '}</span>}
              <span className={valueClass}>
                <ErrorBoundary>
                  <TextInlineBlock
                    name={name}
                    value={value}
                    depth={isFolded ? 1 : 0}
                  />
                </ErrorBoundary>
                {/* {this.createSummary(value, name, isFolded)} */}
              </span>
            </span>
            {!isFolded && this.renderChild(value, name, _indentSize)}
          </span>
        )
      default:
        return (
          <span className='TextBlock'>
            {indentSize > 0 && <span className='TextBlock__indent'>{' '.repeat(indentSize)}</span>}
            {name && <span>{name}</span>}
            {name && <span className='TextBlock__separator'>{': '}</span>}
            <span>{String(value)}</span>
          </span>
        )
    }
  }
}
