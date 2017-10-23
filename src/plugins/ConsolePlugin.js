import React from 'react'
import Plugin from './Plugin'
import './ConsolePlugin.css'

export default class ConsolePlugin extends Plugin {
  constructor (id, name) {
    super(id, name)
    this.ref = null
    this.eventBuffer = []
  }

  onEvent (event, xConsole) {
    // Only focus on console event
    if (!event || event.type !== 'console') return

    // Save console event data before plugin mounted
    if (!this.ref) {
      this.eventBuffer.push(event)
      return
    }

    // Handle 'console.clear()' event
    if (event.detail && event.detail.level === 'clear') {
      this.eventBuffer.length = 0
      this.ref.setState({ events: [] })
      return
    }

    // Show console event on UI
    this.ref.setState({
      events: [...this.ref.state.events, event]
    })
  }

  render () {
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
      events: []
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

  render () {
    return (
      <div>
        {this.state.events.map(event => {
          const { type, detail: { timestamp, level, args } } = event
          return (
            <div key={timestamp} className={`message-container ${level}`}>
              {args.join('')}
            </div>
          )
        })}
      </div>
    )
  }
}
