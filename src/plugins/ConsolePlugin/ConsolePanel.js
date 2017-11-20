import React from 'react'
import MessageBox from './MessageBox'
import './ConsolePanel.css'
import TextInlineBlock from './TextInlineBlock'

export default class ConsolePanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      logLevel: LogLevel.ALL
    }
  }

  componentDidMount () {
    const {messages = []} = this.props
    if (messages.length > 0) {
      this.setState({ messages })
    }
  }

  clearMessages () {
    this.setState({
      messages: []
    })
  }

  onChangeLogLevel (newLogLevel) {
    this.setState({
      logLevel: newLogLevel
    })
  }

  render () {
    const {messages, logLevel} = this.state

    let _messages = messages.filter(msg => new RegExp(msg.level).test(logLevel))

    return (
      <div className='xc-console-panel'>
        <div className='xc-console-panel__toolbar'>
          <span onClick={() => this.clearMessages()} className='fa fa-ban xc-console-panel__clear' />
          <select value={logLevel} onChange={event => this.onChangeLogLevel(event.target.value)}>
            <option value={LogLevel.ALL}>All</option>
            <option value={LogLevel.LOG}>Log</option>
            <option value={LogLevel.ERROR}>Error</option>
            <option value={LogLevel.INFO}>Info</option>
            <option value={LogLevel.WARN}>Warn</option>
            <option value={LogLevel.DEBUG}>Debug</option>
          </select>
        </div>
        <div className='xc-console-panel__content'>
          {/* <div>
            <TextInlineBlock
              value={{
                a: 1,
                b: 'b',
                c: true,
                d: null,
                e: undefined,
                f: function () { },
                g: {},
                h: {a: 1, b: {a: 2, c: {a: 3, d: {e: 3}}}},
                m: [],
                n: [1, 'b']
              }}
              depth={-1}
            />
          </div>
          <div> <TextInlineBlock value={[1, 'b', null, true]} /> </div>
          <div> <TextInlineBlock value={999} /> </div>
          <div> <TextInlineBlock value /> </div>
          <div> <TextInlineBlock value={'hello'} /> </div>
          <div> <TextInlineBlock value={null} /> </div>
          <div> <TextInlineBlock value={undefined} /> </div> */}
          {_messages.map(msg => <MessageBox key={msg.id} message={msg} />)}
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
