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

  render () {
    const {isVisible} = this.props
    const {requestMap} = this.state

    if (!isVisible) return null

    return (
      <div style={{height: '60vh'}}>
        <div className='xcui-rows'>
          <div className='xc-rows__item xc-cols'>
            <span className='xc-cols__item xc--text-center'>Name</span>
            <span className='xc-cols__item xc-cols__item--15 xc--text-center'>Method</span>
            <span className='xc-cols__item xc-cols__item--15 xc--text-center'>Status</span>
          </div>
          {Object.keys(requestMap).map(id => {
            const req = requestMap[id]
            return (
              <div className='xc-rows__item xc-cols' key={id}>
                <span className='xc-cols__item'>{req.url}</span>
                <span className='xc-cols__item xc-cols__item--15 xc--text-center'>{req.method}</span>
                <span className='xc-cols__item xc-cols__item--15 xc--text-center'>{req.status !== undefined ? req.status : '--'}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

/**
 * @typedef {{[id: string]: {id: string, url: string, method: string, status: number}}} RequestMap
 */
