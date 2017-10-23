import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Tabs, Tab} from 'material-ui/Tabs'
import Plugin from './plugins/Plugin'

class XConsole {
  constructor () {
    this.eventListeners = {}
    this.plugins = []

    this.hookConsole()
  }

  // 拦截 console
  hookConsole () {
    const names = ['log', 'info', 'error', 'warn']
    const console = {}
    names.forEach(name => {
      console[name] = window.console[name]
      window.console[name] = (...args) => {
        this.dispatchEvent(new CustomEvent('console', {
          level: 'log',
          // 加个 random 避免 key 重复
          timestamp: Date.now() + Math.random(),
          args
        }))
      }
    })
    // console.log = window.console.log
    // window.console.log = (...args) => {
    //   this.dispatchEvent({
    //     type: 'console',
    //     detail: {
    //       level: 'log',
    //       // 加个 random 避免 key 重复
    //       timestamp: Date.now() + Math.random(),
    //       args
    //     }
    //   })
    //   console.log(...args)
    // }

    this.console = console
  }

  addPlugin (plugin) {
    if (!(plugin instanceof Plugin)) {
      throw new TypeError('Invalid plugin type')
    }

    plugin.xConsole = this

    this.plugins.push(plugin)

    this.initPlugin(plugin)
  }

  initPlugin (plugin) {
    const eventHandler = event => plugin.onEvent(event, this)
    // this.addEventListener('init', eventHandler)  // 会导致每次添加插件都触发一次
    if (typeof plugin.onInit === 'function') {
      plugin.onInit()
    }
    this.addEventListener('ready', eventHandler)
    this.addEventListener('console', eventHandler)

    // this.dispatchEvent({type: 'init'})
  }

  addEventListener (eventType, handler) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = []
    }
    this.eventListeners[eventType].push(handler)
  }

  removeEventListener (eventType, hander) {
    if (this.eventListeners[eventType]) {
      const foundIndex = this.eventListeners[eventType].findIndex(v => v === hander)
      this.eventListeners[eventType].splice(foundIndex, 1)
    }
  }

  dispatchEvent (event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(handler => handler(event))
    }
  }

  render (props) {
    return <XConsoleView plugins={this.plugins} {...props} />
  }
}

class XConsoleView extends Component {
  static propTypes = {
    plugins: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func
  }

  static defaultProps = {
    plugins: [],
    onClose: () => {}
  }

  constructor (props) {
    super(props)
    this.state = {
      value: props.plugins[0] ? props.plugins[0].name : ''
    }
  }

  componentDidMount () {
  }

  render () {
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
            return (
              <Tab key={plugin.id} label={plugin.name} value={plugin.name}>
                {plugin.render()}
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

class Event {
  constructor (type) {
    this.type = type
  }
}

class CustomEvent extends Event {
  constructor (type, detail) {
    super(type)
    this.detail = detail
  }
}

XConsole.Event = Event
XConsole.CustomEvent = CustomEvent

export default XConsole
