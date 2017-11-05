import React from 'react'
import './ConsolePanel.css'

export default class ConsolePluginView extends React.Component {
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
      <div className='xc-console-panel'>
        {/* <div className='xc-console-panel__toolbar'>
          <span>clear</span>
        </div> */}
        <div className='xc-console-panel__content'>
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
      </div>
    )
  }
}
