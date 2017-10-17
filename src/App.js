import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: 'Console',
      logBuffer: []
    }

    const originLog = console.log
    window.console.log = (...args) => {
      const logBuffer = this.state.logBuffer
      logBuffer.push(args.join(''))
      this.setState({ logBuffer })
      originLog(...args)
    }
  }

  render() {
    return (
      <Tabs value={this.state.value} style={{marginTop: '40vh'}} onChange={(value) => this.setState({value})}>
        <Tab label='Console' value='Console'>
          <div style={{overflow: 'scroll', height: '40vh'}}>
            <span>Console</span>
            {this.state.logBuffer.map((value, index) => <p key={index}>{value}</p>)}
          </div>
        </Tab>
        <Tab label='Network' value='Network'>
          <span>Network</span>
        </Tab>
      </Tabs>
    )
  }
}

export default App
