/*
 * Created by whincwu on 2017/10/28
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Tabs, Tab} from './components'

export default class XConsoleView extends Component {
  static propTypes = {
    xConsole: PropTypes.object.isRequired,
    onClose: PropTypes.func
  }

  static defaultProps = {
    onClose: () => {}
  }

  constructor (props) {
    super(props)
    const plugins = props.xConsole.getPlugins()
    this.state = {
      value: plugins[0] ? plugins[0].name : ''
    }
  }

  componentDidMount () {
  }

  render () {
    const {xConsole, onClose} = this.props
    return (
      <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
        <div style={{ height: '40vh' }} onClick={onClose} />
        <Tabs
          style={{ flexGrow: 1, backgroundColor: 'white' }}
          value={this.state.value}
          onChange={value => this.setState({ value })}>
          {xConsole.getPlugins().map((plugin) => {
            return (
              <Tab key={plugin.id} label={plugin.name} value={plugin.name} >
                {plugin.render(xConsole)}
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}
