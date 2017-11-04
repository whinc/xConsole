import React from 'react'
import Plugin from '../Plugin'
import {isFunction, uuid} from '../../utils'
import NetworkPanel from './NetworkPanel'

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
      const [body = null] = args
      console.log('send:', body)
    }

    XMLHttpRequest.prototype.open = function (...args) {
      const xhr = this
      if (!xhr.$isHookOpen) {
        xhr.$isHookOpen = true
        hookOpen(xhr, ...args)
      }

      _open.call(xhr, ...args)
    }

    XMLHttpRequest.prototype.send = function (...args) {
      const xhr = this
      // Hook once
      if (!xhr.$isHookSend) {
        xhr.$isHookSend = true
        hookSend(xhr, ...args)
        setTimeout(() => {
          // 延迟 hook onreadystatechange 方法，因为用户可能在 send 调用之后设置该方法
          const _onreadystatechange = xhr.onreadystatechange

          if (xhr.$isHookOnreadystatechange === true) return

          xhr.onreadystatechange = function (...args) {
            const xhr = this
            if (isFunction(_onreadystatechange)) {
              _onreadystatechange.call(xhr, ...args)
            }
            hookOnreadystatechange(xhr, ...args)
          }

          _send.call(xhr, ...args)
        }, 0)
      } else {
        _send.call(xhr, ...args)
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
      <NetworkPanel
        ref={ref => { this.ui = ref }}
        requestMap={requestMap}
      />
    )
  }
}

/**
 * @typedef {{[id: string]: {id: string, url: string, method: string, status: number}}} RequestMap
 */
