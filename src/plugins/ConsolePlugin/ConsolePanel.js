import React from 'react'
import MessageBox from './MessageBox'
import './ConsolePanel.css'
// import TextInlineBlock from './TextInlineBlock'

export default class ConsolePanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      messages: [],
      // flag indicate if setting panel visble
      isSettingVisible: false,
      // flag indicate if timestamp enable
      isTimestampEnable: false,
      // filter string
      filter: '',
      // javascript code enter by user
      jsCode: '',
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

  changeFilter (value) {
    this.setState({
      filter: value
    })
  }

  changeJSCode (code) {
    this.setState({
      jsCode: code
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

  executeJSCode () {
    try {
      eval(this.state.jsCode)
    } catch (error) {
      window.xConsole.commands.dispatch('console:error', {texts: [error]})
    }
  }

  render () {
    const {messages, logLevel, filter, isSettingVisible, isTimestampEnable, jsCode} = this.state

    // filte messages with the filter rules
    let _messages = messages.filter(msg => {
      let b1 = new RegExp(msg.level).test(logLevel)
      let b2 = true
      if (filter) {
        // TODO: use the formated string to match instead of the origin arguments
        const content = JSON.stringify(msg.texts)
        // try match with regular expression, if it's failed use string search
        try {
          b2 = new RegExp(filter, 'i').test(content)
        } catch (error) {
          b2 = content.indexOf(filter) !== -1
        }
      }
      return b1 && b2
    })

    let rows = 0
    if (jsCode) {
      rows = jsCode.split('').reduce((n, c) => c === '\n' ? ++n : n, 0) + 1
    }

    return (
      <div className='ConsolePanel'>
        <div className='ConsolePanel__toolbar ConsolePanel-toolbar'>
          <div className='ConsolePanel-toolbar__clear'>
            <span onClick={() => this.clearMessages()} className='fa fa-ban' />
          </div>
          <div className='ConsolePanel-toolbar__filter'>
            <input type='text' placeholder='Filter' value={filter} onChange={e => this.changeFilter(e.target.value)} />
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
          <div className='ConsolePanel-expression'>
            <textarea
              value={jsCode}
              onChange={e => this.changeJSCode(e.target.value)}
              rows={Math.max(rows, 2)}
              placeholder='Enter expression here'
              className='ConsolePanel-expression__input'
            />
            <button className='ConsolePanel-expression__button' onClick={e => this.executeJSCode()}>exec</button>
          </div>
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
