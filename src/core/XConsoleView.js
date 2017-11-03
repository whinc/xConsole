/*
 * Created by whincwu on 2017/10/28
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Tabs, Tab} from '../components'
import {isFunction} from '../utils'

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
    this.state = {
      value: ''
    }

    // bind methods used in JSX
    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount () {
    const plugins = this.props.xConsole.getPlugins()
    this.changeTab(plugins[0] ? plugins[0].id : '')
  }

  changeTab (newValue, oldValue) {
    this.setState({value: newValue})
    setTimeout(() => {
      const plugins = this.props.xConsole.getPlugins()
      // trigger 'hide' event of disactived plugin
      const disactivedPlugin = plugins.find(plugin => plugin.id === oldValue)
      if (isFunction(disactivedPlugin.onHide)) {
        disactivedPlugin.onHide()
      }
      // trigger 'show' event of actived plugin
      const activedPlugin = plugins.find(plugin => plugin.id === newValue)
      if (isFunction(activedPlugin.onShow)) {
        activedPlugin.onShow()
      }
    }, 0)
  }

  render () {
    const {xConsole, onClose} = this.props
    return (
      <div style={{display: 'flex', flexGrow: 1, flexDirection: 'column'}}>
        <div style={{ height: '40vh' }} onClick={onClose} />
        <Tabs
          style={{ flexGrow: 1, backgroundColor: 'white' }}
          value={this.state.value}
          onChange={this.changeTab}>
          {xConsole.getPlugins().map((plugin) => {
            return (
              <Tab key={plugin.id} label={plugin.name} value={plugin.id} >
                {isFunction(plugin.render) && plugin.render(xConsole)}
              </Tab>
            )
          })}
        </Tabs>
      </div>
    )
  }
}
