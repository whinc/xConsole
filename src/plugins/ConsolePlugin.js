import React from 'react'
import Plugin from './Plugin'

export default class ConsolePlugin extends Plugin {
  constructor (id, name) {
    super(id, name)
    this.ref = null
    this.eventBuffer = []
  }

  onConsole (event, xConsole) {
    if (!this.ref) {
      // 组件尚未显示前，先保存事件
      this.eventBuffer.push(event)
      return
    }

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
          return <p key={timestamp}>{type}:{level}:{args.join('')}</p>
        })}
      </div>
    )
  }
}
