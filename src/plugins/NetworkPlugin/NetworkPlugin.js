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
  }

  onInit () {
    this.hookXMLHttpRequest()
    this.hookFetch()
  }

  hookXMLHttpRequest () {
    const self = this
    const XMLHttpRequest = window.XMLHttpRequest
    const _send = XMLHttpRequest.prototype.send
    const _open = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function (method, url, async, username, password) {
      const xhr = this
      if (!utils.get(xhr, 'hasHookOpenMethod')) {
        utils.set(xhr, 'hasHookOpenMethod', true)
        self.handleXMLHttpRequestOpen(xhr, method, url, async, username, password)
      }

      // call origin open method with passed arguments
      _open.call(xhr, ...arguments)
    }

    XMLHttpRequest.prototype.send = function (body) {
      const xhr = this
      // Hook once
      if (!utils.get(xhr, 'hasHookSendMethod')) {
        utils.set(xhr, 'hasHookSendMethod', true)
        self.handleXMLHttpRequestSend(xhr, body)
        setTimeout(() => {
          // hook 'onreonreadystatechange' in next event loop because of user may
          // setup 'onreonreadystatechange' handler after send method has been called
          const _onreadystatechange = xhr.onreadystatechange
          xhr.onreadystatechange = function (event) {
            const xhr = this
            if (isFunction(_onreadystatechange)) {
              _onreadystatechange.call(xhr, ...arguments)
            }
            self.handleXMLHttpRequestReadStateChange(xhr, event)
          }

          _send.call(xhr, ...arguments)
        }, 0)
      } else {
        _send.call(xhr, ...arguments)
      }
    }
  }

  handleXMLHttpRequestSend (xhr, body) {
    console.log('send:', body)
  }

  handleXMLHttpRequestOpen (xhr, method, url, async, username, password) {
    console.log('open: ', method, url, async, username, password)

    const id = uuid()
    utils.set(xhr, 'id', id)
    utils.set(xhr, 'method', method)
    utils.set(xhr, 'url', url)
    this.addOrUpdateRequest(id, { url, method })
  }

  handleXMLHttpRequestReadStateChange (xhr, event) {
    console.log('onreadystatechange: %O', event)
    this.addOrUpdateRequest(utils.get(xhr, 'id'), { status: xhr.status })
  }

  hookFetch () {

  }

  addOrUpdateRequest (id, req) {
    if (!id || !req) return
    req.id = id

    // if ui has been created, concat the request info
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

  render () {
    const requestMap = this.requestMap
    this.requestMap = {}

    const r = (
      <NetworkPanel
        ref={ref => { this.ui = ref }}
        requestMap={requestMap}
      />
    )
    return r
  }
}

const utils = {
  get: (xhr, key) => {
    if (xhr && xhr.__xconsole__) {
      return xhr.__xconsole__[key]
    } else {
      return undefined
    }
  },
  set: (xhr, key, value) => {
    if (!xhr) {
      console.error('xhr is empty')
      return
    }

    if (!xhr.__xconsole__) {
      xhr.__xconsole__ = {}
    }

    xhr.__xconsole__[key] = value
  },
  has: (xhr, key) => {
    if (xhr && xhr.__xconsole__) {
      return xhr.__xconsole__[key] !== undefined
    } else {
      return false
    }
  }
}

/**
 * @typedef {{[id: string]: {id: string, url: string, method: string, status: number}}} requestmap
 */
