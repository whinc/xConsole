import React from 'react'
import Plugin from '../Plugin'
import ConsolePanel from './ConsolePanel'

export default class ConsolePlugin extends Plugin {
  constructor (id, name) {
    super(id, name)
    this.ref = null
    this.eventBuffer = []
  }

  onInit () {
    // Hold native console object
    this.console = this.hookConsole()
  }

  // Hook native console methods
  hookConsole () {
    const console = {}
    const methodNames = ['log', 'info', 'error', 'warn', 'debug', 'clear']
    methodNames.forEach(name => {
      // save native console methods
      console[name] = window.console[name]

      // hook console methods
      window.console[name] = (...args) => {
        let event
        switch (name) {
          case 'log':
          case 'info':
          case 'error':
          case 'warn':
          case 'debug':
            event = {
              type: 'console',
              detail: {
                level: name,
                args,
                timestamp: Date.now()
              }
            }
            break
          case 'clear':
            event = {
              type: 'console',
              detail: {
                level: name,
                args: ['Console was cleared'],
                timestamp: Date.now()
              }
            }
            break
          default:
            event = null
            break
        }

        // trigger event if it's not null
        if (event) {
          this.onEvent(event)
        }

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

    event.detail = event.detail || {}
    switch (event.detail.level) {
      case 'clear':
        this.eventBuffer.length = 0
        this.ref.setState({ events: [event] })
        return
      default: break
    }

    // Show console event on UI
    this.ref.setState((preState, props) => {
      return { events: [...preState.events, event] }
    })
  }

  render () {
    const eventBuffer = this.eventBuffer
    this.eventBuffer.length = 0

    return (
      <ConsolePanel
        eventBuffer={eventBuffer}
        ref={ref => (this.ref = ref)}
      />
    )
  }
}
