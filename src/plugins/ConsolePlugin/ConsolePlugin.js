import React from 'react'
import Plugin from '../Plugin'
import './ConsolePlugin.css'

export default class ConsolePlugin extends Plugin {
  constructor (id, name) {
    super(id, name)
    this.ref = null
    this.eventBuffer = []
  }

  onEvent (xConsole, event) {
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

  render (xConsole) {
    return (
      <ConsolePluginView
        eventBuffer={this.eventBuffer}
        ref={ref => (this.ref = ref)}
      />
    )
  }
}

class ConsolePluginView extends React.Component {
  constructor () {
    super(...arguments)
    this.state = {
      events: [],
      isTimestampVisible: true
    }
  }

  componentDidMount () {
    const {eventBuffer} = this.props
    if (eventBuffer.length > 0) {
      this.setState({
        events: [...this.state.events, ...eventBuffer]
      })
      eventBuffer.length = 0
    }
  }

  formatDate (timestamp) {
    const align = (input, length = 2) => {
      input = String(input)
      if (input.length < length) {
        return '0'.repeat(length - input.length) + input
      } else {
        return input
      }
    }
    const d = new Date(timestamp)
    return align(d.getHours()) + ':' + align(d.getMinutes()) + ':' + align(d.getSeconds()) + '.' + align(d.getMilliseconds(), 3)
  }

  render () {
    const {events, isTimestampVisible} = this.state
    return (
      <div>
        {events.map((event, index) => {
          const { detail: { timestamp, level, args } } = event
          return (
            <div key={index} className={`msg-box ${level}`}>
              {isTimestampVisible && <span className={'timestamp'}>{this.formatDate(timestamp)}</span>}
              {' '}
              <span>{args.join('')}</span>

            </div>
          )
        })}
      </div>
    )
  }
}
