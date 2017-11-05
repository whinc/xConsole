import React from 'react'
import Plugin from '../Plugin'
import ConsolePanel from './ConsolePanel'

export default class ConsolePlugin extends Plugin {
  constructor (id, name) {
    super(id, name)
    this.ref = null
    this.eventBuffer = []
    // Hold native console object
    this.console = this.hookConsole()
  }

  // Hook native console methods
  hookConsole () {
    const console = {}
    const names = ['log', 'info', 'error', 'warn', 'debug', 'clear']
    names.forEach(name => {
      // save native console methods
      console[name] = window.console[name]

      window.console[name] = (...args) => {
        let _level = name
        let _args = args
        if (name === 'clear') {
          _level = 'system'
          _args = ['Console was cleared']
        }
        const event = this.xConsole.createEvent('console', {level: _level, args: _args})
        this.onEvent(event)

        // call native console method
        console[name](...args)
      }
    })
    return console
  }

  onEvent (event) {
    // Only focus on console event
    if (!event || event.type !== 'console') return

    // Save console event data before plugin mounted
    if (!this.ref) {
      this.eventBuffer.push(event)
      return
    }

    // Handle 'console.clear()' event
    if (event.detail && event.detail.level === 'system') {
      this.eventBuffer.length = 0
      this.ref.setState({ events: [event] })
      return
    }

    // Show console event on UI
    this.ref.setState({
      events: [...this.ref.state.events, event]
    })
  }

  onHide () {
    super.onHide()
    if (this.ref) {
      this.eventBuffer = this.ref.state.events
    }
  }

  render () {
    return (
      <ConsolePanel
        eventBuffer={this.eventBuffer}
        ref={ref => (this.ref = ref)}
      />
    )
  }
}
