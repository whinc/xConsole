import React from 'react'
import Plugin from '../Plugin'

export default class NetworkPlugin extends Plugin {
  onInit () {
    this.hookXMLHttpRequest()
    this.hookFetch()
  }

  hookXMLHttpRequest () {
    const XMLHttpRquest = window.XMLHttpRequest
    const _send = XMLHttpRequest.prototype.send
    const _open = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.send = function (...args) {
      _send.call(this, ...args)
      console.log('send XMLHttpRequest:' + args.join(' '))
    }

    XMLHttpRequest.prototype.open = function (...args) {
      _open.call(this, ...args)
      console.log('open XMLHttpRequest:' + args.join(' '))
    }
  }

  hookFetch () {

  }

  render (xConsole) {
    return (
      <NetworkPluginView />
    )
  }
}

class NetworkPluginView extends React.Component {
  sendXMLHttpRequest () {
    const xhr = new window.XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.responseText)
        } else {
          console.error(xhr.statusText)
        }
      }
    }
    xhr.open('GET', 'https://api.github.com/users/octocat/orgs')
    xhr.send(null)
  }
  render () {
    return (
      <div><button onClick={() => this.sendXMLHttpRequest()}>Send Ajax</button></div>
    )
  }
}
