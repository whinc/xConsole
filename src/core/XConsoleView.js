/*
 * Created by whincwu on 2017/10/28
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {isFunction} from '../utils'

export default class XConsoleView extends Component {
  static propTypes = {
    plugins: PropTypes.arrayOf(PropTypes.object),
    onClose: PropTypes.func
  }

  static defaultProps = {
    plugins: [],
    onClose: () => {}
  }

  constructor (props) {
    super(props)
    const plugins = props.plugins
    this.state = {
      // actived plugin id
      value: plugins.length > 0 ? plugins[0].id : undefined
    }
    this.cachedPluginViews = {}

    // bind methods used in JSX
    this.changeTab = this.changeTab.bind(this)
  }

  componentDidMount () {
    const plugins = this.props.plugins
    this.changeTab(plugins[0] ? plugins[0].id : '')
  }

  changeTab (newValue, oldValue) {
    const plugins = this.props.plugins
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

    this.setState({ value: newValue })
  }

  render () {
    const {plugins, onClose} = this.props
    const {value} = this.state
    return (
      <div className='xc-container'>
        <div className='xc-container__mask' onClick={onClose} />
        <div className='xc-container__content'>
          <div className='xc-panel'>
            <div className='xc-panel__header'>
              <div className='xc-tabs'>
                {plugins.map(plugin => {
                  const isLast = plugins[plugins.length - 1].id === plugin.id
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
              {plugins.map(plugin => {
                let hidden = plugin.id !== value ? 'xc-tab-panel--hidden' : ''
                return (
                  <div key={plugin.id} className={`xc-tab-panel ${hidden}`}>
                    {isFunction(plugin.render) && plugin.render()}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
