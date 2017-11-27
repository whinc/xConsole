import React from 'react'
import MessageBox from './MessageBox'
import './ConsolePanel.css'
// import TextInlineBlock from './TextInlineBlock'

export default class ConsolePanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      // is setting panel visble
      isSettingVisible: false,
      // is timestamp enable
      isTimestampEnable: false,
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

  toggleTimestampEnable () {
    this.setState({
      ...this.state,
      isTimestampEnable: !this.state.isTimestampEnable
    })
  }

  toggleSettingVisible () {
    this.setState({
      ...this.state,
      isSettingVisible: !this.state.isSettingVisible
    })
  }

  render () {
    const {messages, logLevel, isSettingVisible, isTimestampEnable} = this.state

    let _messages = messages.filter(msg => new RegExp(msg.level).test(logLevel))

    return (
      <div className='ConsolePanel'>
        <div className='ConsolePanel__toolbar ConsolePanel-toolbar'>
          <div className='ConsolePanel-toolbar__clear'>
            <span onClick={() => this.clearMessages()} className='fa fa-ban' />
          </div>
          <div className='ConsolePanel-toolbar__filter'>
            <select value={logLevel} onChange={event => this.onChangeLogLevel(event.target.value)}>
              <option value={LogLevel.ALL}>All</option>
              <option value={LogLevel.LOG}>Log</option>
              <option value={LogLevel.ERROR}>Error</option>
              <option value={LogLevel.INFO}>Info</option>
              <option value={LogLevel.WARN}>Warn</option>
              <option value={LogLevel.DEBUG}>Debug</option>
            </select>
          </div>
          <div className='ConsolePanel-toolbar__setting' onClick={e => this.toggleSettingVisible()}>
            <span className='fa fa-cog' style={{color: isSettingVisible ? 'rgb(81, 128, 229)' : ''}} />
          </div>
        </div>
        {isSettingVisible &&
          <div className='ConsolePanel__setting'>
            <div>
              <label>
                <input type='checkbox'
                  value={isTimestampEnable}
                  onChange={e => this.toggleTimestampEnable()}
                />
                Show timestamps
            </label>
            </div>
          </div>
        }
        <div className='ConsolePanel__content'>
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
          {_messages.map(msg =>
            <MessageBox
              key={msg.id}
              message={msg}
              isTimestampVisible={isTimestampEnable}
            />
          )}
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
