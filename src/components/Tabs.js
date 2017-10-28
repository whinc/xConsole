/*
 * Created by whincwu on 2017/10/28
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Tabs extends Component {
  static propTypes = {
    style: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func
  }

  render () {
    const {children, style, value, onChange} = this.props
    const _children = React.Children.toArray(children).filter((child, index) => {
      const valid = React.isValidElement(child) && child.type.name === 'Tab'
      if (!valid) {
        console.warn(`The ${index} child of <Tabs> is <${child.type}> instead of <Tab>`)
      }
      return valid
    })
    return (
      <div style={{flexDirection: 'column', ...style}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '44px'}}>
          {_children.map((child, index) => {
            const {value, label} = child.props
            const extraStyle = index !== _children.length - 1 ? {borderRight: '1px solid gray'} : {}
            return (
              <div
                key={value}
                onClick={() => onChange(value)}
                style={{flexGrow: 1, borderBottom: '1px solid gray', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...extraStyle}}>
                <span>{label}</span>
              </div>
            )
          })}
        </div>
        <div>
          {_children.map((child, index) => {
            return React.cloneElement(child, {_visible: child.props.value === value})
          })}
        </div>
      </div>
    )
  }
}
