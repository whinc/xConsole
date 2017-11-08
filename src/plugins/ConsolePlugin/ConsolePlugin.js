import React from 'react'
import Plugin from '../Plugin'
import ConsolePanel from './ConsolePanel'

/**
 * Display messages from console.
 *
 * Supported commands:
 * * 'console:log'
 * * 'console:info'
 * * 'console:warn'
 * * 'console:error'
 * * 'console:debug'
 * * 'console:clear'
 *
 * Example:
 * window.xConsole.commands.dispatch('console:warn', {texts: ['hello']})
 */
export default class ConsolePlugin extends Plugin {
  constructor (id, name) {
    super(id, name)
    this.ref = null
    this.eventBuffer = []
    // cache messages before consumed by ConsolePanel
    this._messages = []
  }

  onInit () {
    // Hold native console object
    this._nativeConsole = this._hookConsole()

    // register commands
    window.xConsole.commands.add('console:log', value => this._handleCommandPrint('log', value))
    window.xConsole.commands.add('console:info', value => this._handleCommandPrint('info', value))
    window.xConsole.commands.add('console:warn', value => this._handleCommandPrint('warn', value))
    window.xConsole.commands.add('console:error', value => this._handleCommandPrint('error', value))
    window.xConsole.commands.add('console:debug', value => this._handleCommandPrint('debug', value))
    window.xConsole.commands.add('console:clear', value => this._handleCommandClear())
  }

  _genId () {
    return (typeof this._messageId === 'number')
      ? (++this._messageId)
      : (this._messageId = 1)
  }

  _handleCommandClear () {
    if (this.ref) {
      this.ref.clearMessages()
      this._handleCommandPrint('log', {texts: ['Console was cleared']})
    } else {
      this._clearMessages()
    }
  }

  _handleCommandPrint (level, value = {}) {
    const { texts = [], timestamp = Date.now() } = value

    const message = {
      id: this._genId(),
      timestamp,
      texts,
      level
    }

    if (this.ref) {
      // Show console event on UI
      this.ref.setState((preState, props) => {
        return { messages: [...preState.messages, message] }
      })
    } else {
      this._messages.push(message)
    }
  }

  // Hook native console methods. It does two things:
  // 1. call native mathods
  // 2. dispatch console event to ConsolePanel
  _hookConsole () {
    const console = {}
    const methodNames = ['log', 'info', 'error', 'warn', 'debug', 'clear']
    methodNames.forEach(name => {
      // save native console methods
      console[name] = window.console[name]

      // hook console methods
      window.console[name] = (...args) => {
        if (/^(log|info|error|warn|debug)$/.test(name)) {
          this._handleCommandPrint(name, { texts: args })
        } else {
          this._handleCommandClear()
        }

        // call native console method
        console[name](...args)
      }
    })
    return console
  }

  _clearMessages () {
    this._messages.length = 0
  }

  _getAndClearMessages () {
    const messages = [...this._messages]
    this._messages.length = 0
    return messages
  }

  render () {
    return (
      <ConsolePanel
        messages={this._getAndClearMessages()}
        ref={ref => (this.ref = ref)}
      />
    )
  }
}
