import React from 'react'
import Plugin from './Plugin'

export default class NetworkPlugin extends Plugin {
  render (xConsole) {
    return (
      <NetworkPluginView />
    )
  }
}

class NetworkPluginView extends React.Component {
  render () {
    return (
      <div>Network</div>
    )
  }
}
