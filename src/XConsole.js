import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Tabs, Tab} from 'material-ui/Tabs'

/**
 * XConsole 同时肩负两个职责:
 * 1. 作为组件，负责渲染面板视图
 * 2. 作为插件管理者，向插件提供接口、数据、事件分发
 * 
 * @class XConsole
 * @extends {Component}
 */
class XConsole extends Component {
  static propTypes = {
    plugins: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func
  }

  static defaultProps = {
    plugins: [],
    onClose: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.plugins[0] ? props.plugins[0].name : ''
    }
  }

  componentDidMount() {
    const originLog = window.console.log
    window.console.log = (...args) => {
      XConsole.dispatchEvent({
        type: 'console:log',
        detail: {
          timestamp: Date.now(),
          args
        }
      })
      originLog(...args)
    }
  }

  render() {
    const {plugins, onClose} = this.props
    return (
      <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
        <div style={{ height: '40vh' }} onClick={onClose} />
        <Tabs
          style={{ flexGrow: 1, backgroundColor: 'white' }}
          value={this.state.value}
          onChange={(value) => this.setState({ value })}
        >
          {plugins.map((plugin) => {
            const { name, component: Plugin } = plugin
            return (
              <Tab key={name} label={name} value={name}>
                <Plugin xConsole={XConsole} />
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

Object.assign(XConsole, {
  eventListeners: {},
  plugins: [],

  addPlugin(plugin) {
    this.plugins.push(plugin)
  },

  addEventListener(eventType, handler) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = []
    }
    this.eventListeners[eventType].push(handler)
  },

  removeEventListener(eventType, hander) {
    if (this.eventListeners[eventType]) {
      const foundIndex = this.eventListeners[eventType].findIndex(v => v === hander)
      this.eventListeners[eventType].splice(foundIndex, 1)
    }
  },

  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(handler => handler(event))
    }
  }
})

export default XConsole
