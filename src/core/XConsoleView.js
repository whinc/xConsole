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
    const plugins = props.xConsole.getPlugins()
    this.state = {
      // actived plugin id
      value: plugins.length > 0 ? plugins[0].id : undefined
    }

    // bind methods used in JSX
    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount () {
    const plugins = this.props.xConsole.getPlugins()
    this.changeTab(plugins[0] ? plugins[0].id : '')
  }

  changeTab (newValue, oldValue) {
    this.setState({ value: newValue })

    const plugins = this.props.xConsole.getPlugins()
    // trigger 'hide' event of disactived plugin before rerender
    const disactivedPlugin = plugins.find(plugin => plugin.id === oldValue)
    if (disactivedPlugin && isFunction(disactivedPlugin.onHide)) {
      disactivedPlugin.onHide()
    }
    // trigger 'show' event of actived plugin before rerender
    const activedPlugin = plugins.find(plugin => plugin.id === newValue)
    if (activedPlugin && isFunction(activedPlugin.onShow)) {
      activedPlugin.onShow()
    }
  }

  render () {
    const {xConsole, onClose} = this.props
    const {value} = this.state
    return (
      <div className='xc-container'>
        <div className='xc-container__mask' onClick={onClose} />
        <div className='xc-container__content'>
          <div className='xc-panel'>
            <div className='xc-panel__header'>
              <div className='xc-tabs'>
                {xConsole.getPlugins().map(plugin => {
                  const isLast = xConsole.getPlugins()[xConsole.getPlugins().length - 1].id === plugin.id
                  return (<div
                    key={plugin.id}
                    className={'xc-tabs__tab xc-cols xc-cols--center' + (isLast ? ' xc-tabs__tab--noborder' : '')}
                    onClick={() => plugin.id !== value && this.changeTab(plugin.id, value)}
                  >
                    <span>{plugin.name}</span>
                  </div>
                  )
                })}
              </div>
            </div>
            <div className='xc-panel__content'>
              {xConsole.getPlugins().map(plugin =>
                <div key={plugin.id} className=''>
                  { plugin.id === value && isFunction(plugin.render) && plugin.render(xConsole)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
