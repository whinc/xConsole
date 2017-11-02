import React from 'react'
import Plugin from '../Plugin'
// import './NetworkPlugin.css'

export default class NetworkPlugin extends Plugin {
  constructor () {
    super(...arguments)
    this.ui = null
    /**
     * @type RequestMap
     */
    this.requestMap = {}

    this.hookXMLHttpRequest()
    this.hookFetch()
  }

  hookXMLHttpRequest () {
    const XMLHttpRequest = window.XMLHttpRequest
    const _send = XMLHttpRequest.prototype.send
    const _open = XMLHttpRequest.prototype.open

    const hookOnreadystatechange = (xhr, ...args) => {
      const [event] = args
      console.log('onreadystatechange: %O', event)
      this.addOrUpdateRequest(xhr.$id, { status: xhr.status })
    }

    const hookOpen = (xhr, ...args) => {
      const [method, url, async = true, username = null, password = null] = args
      console.log('open: ', method, url, async, username, password)

      const id = uuid()
      xhr.$id = id
      xhr.$method = method
      xhr.$url = url
      this.addOrUpdateRequest(id, { url, method })
    }

    const hookSend = (xhr, ...args) => {
      // 延迟 hook onreadystatechange 方法，因为用户可能在 send 调用之后设置该方法
      setTimeout(() => {
        const _onreadystatechange = xhr.onreadystatechange

        // 这两种情况不执行 hook:
        // 1. 未设置状态监听函数
        // 2. 已经 hook 过
        if (typeof _onreadystatechange !== 'function' || xhr.$isHookOnreadystatechange === true) return

        xhr.onreadystatechange = function (...args) {
          const xhr = this
          _onreadystatechange.call(xhr, ...args)
          hookOnreadystatechange(xhr, ...args)
        }
      }, 0)

      const [body = null] = args
      console.log('send:', body)
    }

    XMLHttpRequest.prototype.open = function (...args) {
      const xhr = this
      _open.call(xhr, ...args)

      if (!xhr.$isHookOpen) {
        xhr.$isHookOpen = true
        hookOpen(xhr, ...args)
      }
    }

    XMLHttpRequest.prototype.send = function (...args) {
      const xhr = this
      _send.call(xhr, ...args)

      // Hook once
      if (!xhr.$isHookSend) {
        xhr.$isHookSend = true
        hookSend(xhr, ...args)
      }
    }
  }

  hookFetch () {

  }

  addOrUpdateRequest (id, req) {
    if (!id || !req) return
    req.id = id

    // 全部放到缓冲区进行操作
    if (this.ui) {
      this.requestMap = {...this.requestMap, ...this.ui.state.requestMap}
    }

    // 如果请求不存在则添加，否则更新请求信息
    const foundRequest = this.requestMap[id]
    if (!foundRequest) {
      this.requestMap[id] = req
    } else {
      Object.assign(foundRequest, req)
    }

    if (this.ui) {
      this.ui.setState({
        requestMap: {...this.requestMap}
      })
      // clear buffer after render
      this.requestMap = {}
    }
  }

  render (xConsole) {
    const requestMap = this.requestMap
    this.requestMap = {}

    return (
      <NetworkPluginPanel
        ref={ref => { this.ui = ref }}
        requestMap={requestMap}
      />
    )
  }
}

class NetworkPluginPanel extends React.Component {
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
    const {requestMap} = this.state

    return (
      <div style={{height: '100%'}}>
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
                <span className='xc-cols__item xc-cols__item--15 xc--text-center'>{req.status}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

/**
 * generate an unique id string (32)
 * @private
 * @return string
 */
function uuid () {
  let id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0
    let v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
  return id
}

/**
 * @typedef {{[id: string]: {id: string, url: string, method: string, status: number}}} RequestMap
 */
