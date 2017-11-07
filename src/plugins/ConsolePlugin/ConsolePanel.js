import React from 'react'
import './ConsolePanel.css'

export default class ConsolePluginView extends React.Component {
  constructor () {
    super(...arguments)
    this.state = {
      events: [],
      isTimestampVisible: true,
      logLevel: LogLevel.ALL
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

  onClickClear () {
    this.setState({
      events: []
    })
  }

  onChangeLogLevel (newLogLevel) {
    this.setState({
      logLevel: newLogLevel
    })
  }

  render () {
    const {events, isTimestampVisible, logLevel} = this.state

    let filteredEvents = events.filter(event => new RegExp(event.detail.level).test(logLevel))

    return (
      <div className='xc-console-panel'>
        <div className='xc-console-panel__toolbar'>
          <span onClick={() => this.onClickClear()} className='fa fa-ban xc-console-panel__clear' />
          <select value={logLevel} onChange={event => this.onChangeLogLevel(event.target.value)}>
            <option value={LogLevel.ALL}>All</option>
            <option value={LogLevel.LOG}>Log</option>
            <option value={LogLevel.ERROR}>Error</option>
          </select>
        </div>
        <div className='xc-console-panel__content'>
          {filteredEvents.map((event, index) => {
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

const LogLevel = {
  ALL: 'log info warn error debug',
  LOG: 'log',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug'
}
