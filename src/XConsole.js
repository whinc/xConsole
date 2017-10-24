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
    const console = {}
    const names = ['log', 'info', 'error', 'warn', 'clear']
    names.forEach(name => {
      console[name] = window.console[name]
      window.console[name] = (...args) => {
        let _level = name
        let _args = args
        if (name === 'clear') {
          _level = 'system'
          _args = ['Console was cleared']
        }
        this.dispatchEvent(this.createEvent('console', {level: _level, args: _args}))

        // call native console method
        console[name](...args)
      }
    })

    // save native console object in xConsole
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

  createEvent (type, detail) {
    return {
      type: type,
      detail: {
        ...detail,
        timestamp: Date.now()
      }
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
              <Tab key={plugin.id} label={plugin.name} value={plugin.name} >
                <div style={{overflowY: 'auto', height: '60vh'}}>
                  {plugin.render()}
                </div>
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}

export default XConsole
