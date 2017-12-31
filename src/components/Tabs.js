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

  // Filter out child that is not <Tab> type
  getTabs () {
    return React.Children.toArray(this.props.children).filter((child, index) => {
      const valid = React.isValidElement(child)
      if (!valid) {
        window.xConsole.console && window.xConsole.console.warn(`The ${index} child of <Tabs> is <${child.type}> instead of <Tab>`)
      }
      return valid
    })
  }

  render () {
    const {style, value, onChange = () => {}} = this.props

    return (
      <div style={{flexDirection: 'column', ...style}}>
        <div style={{display: 'flex', flexDirection: 'row', height: '44px', borderBottom: '1px solid gray'}}>
          {this.getTabs().map((tab, index) => {
            const extraStyle = index !== this.getTabs().length - 1 ? {borderRight: '1px solid gray'} : {}
            return (
              <div
                key={tab.props.value}
                onClick={() => value !== tab.props.value && onChange(tab.props.value, value)}
                style={{flexGrow: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', ...extraStyle}}>
                <span>{tab.props.label}</span>
              </div>
            )
          })}
        </div>
        <div>
          {this.getTabs().map(tab =>
            React.cloneElement(tab, {_visible: tab.props.value === value})
          )}
        </div>
      </div>
    )
  }
}
