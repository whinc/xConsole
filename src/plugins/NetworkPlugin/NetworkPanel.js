import React from 'react'
import './NetworkPanel.css'

export default class NetworkPluginPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      /**
       * 请求信息
       * @type {{[id: string]: {id: string, url: string, method: string, status: number}}}
       */
      requestMap: props.requestMap || {}
    }
  }

  parseUrl (url) {
    if (typeof url !== 'string') return String(url)

    const lastSlashIndex = url.lastIndexOf('/')
    const name = url.substr(lastSlashIndex + 1)

    return {name}
  }

  render () {
    const {requestMap} = this.state

    const count = Object.keys(requestMap).length
    return (
      <div style={{ height: '60vh' }} className='NetworkPanel'>
        <div className='NetworkPanel__header'>
          <span className='NetworkPanel__item NetworkPanel__item--grow'>
            Name{count > 0 ? `(${count})` : ''}
          </span>
          <span className='NetworkPanel__item'>Method</span>
          <span className='NetworkPanel__item'>Status</span>
        </div>
        {Object.keys(requestMap).map(id => {
          const req = requestMap[id]
          const {name} = this.parseUrl(req.url)
          return (
            <div className='NetworkPanel__row' key={id}>
              <span className='NetworkPanel__item NetworkPanel__item--grow'>{name}</span>
              <span className='NetworkPanel__item'>{req.method}</span>
              <span className='NetworkPanel__item'>{req.status !== undefined ? req.status : '--'}</span>
            </div>
          )
        })}
      </div>
    )
  }
}

/**
 * @typedef {{[id: string]: {id: string, url: string, method: string, status: number}}} RequestMap
 */
