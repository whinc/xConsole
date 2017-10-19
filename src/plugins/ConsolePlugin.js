import React from 'react'
import Plugin from './Plugin'

export default class ConsolePlugin extends Plugin {
  constructor (props) {
    super(props)

    this.state = {
      events: []
    }
    const {xConsole} = props

    xConsole.addEventListener('console:log', event => {
      this.setState({
        events: [...this.state.events, event]
      })
    })
  }

  render () {
    return (
      <div>
        {this.state.events.map(event =>
          <p key={event.detail.timestamp}>{event.detail.timestamp}:{event.type}:{event.detail.args.join('')}</p>
        )}
      </div>
    )
  }
}
