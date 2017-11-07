/*
 * Created by whincwu on 2017/10
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {Emitter} from 'event-kit'
import './XConsole.css'
import XConsoleView from './XConsoleView'
import ConsolePlugin from '../plugins/ConsolePlugin'
import NetworkPlugin from '../plugins/NetworkPlugin'
import {isFunction, isObject} from '../utils'

class XConsole {
  constructor () {
    this._panel = null
    this._entry = null
    this._plugins = []
    this._emitter = new Emitter()
  }

  init () {
    this._showEntry()
    this._addPlugin(new ConsolePlugin('xConsole:Console', 'Console'))
    this._addPlugin(new NetworkPlugin('xConsole:Network', 'Network'))
    // this.addPlugin({
    //   id: 'xConsole:Storage',
    //   name: 'Storage',
    //   render () {
    //     return <p>Storage</p>
    //   }
    // })
  }

  /**
   * Registers a handler to be invoked whenever the given event is emitted.
   * @param {string} eventName - Consisits of namespace and name, e.g. 'namespace:name'.
   *                             If either part consists of multiple words, these must be separated by hyphens.
   * @param {function} handler
   * @returns {Disposable}
   */
  on (eventName, handler) {
    this._emitter.on(eventName, handler)
  }

  /**
   * Invoke handlers registered via Emitter#on() for the given event name.
   * @param {string} eventName
   * @param {any=} value
   * @returns {void}
   */
  emit (eventName, value = {}) {
    if (isObject(value)) {
      Object.assign(value, {
        timestamp: Date.now()
      })
    }
    this._emitter.emit(eventName, value)
  }

  _showEntry () {
    if (!this._entry) {
      this._entry = document.createElement('div')
      this._entry.classList.add('entry')
      ReactDOM.render(
        <button onClick={() => this._showPanel()}>xConsole</button>
        , this._entry)
    }
    document.body.appendChild(this._entry)
  }

  _hideEntry () {
    if (this._entry) {
      document.body.removeChild(this._entry)
    }
  }

  _showPanel () {
    if (!this._panel) {
      this._panel = document.createElement('div')
      this._panel.classList.add('panel')
      ReactDOM.render(
        <XConsoleView
          plugins={this._plugins}
          onClose={() => this._hidePanel()}
        />
        , this._panel)
    }
    // mask animation
    this._panel.classList.add('animated', 'fadeIn')
    this._panel.classList.remove('fadeOut')
    // panel animation
    this._panel.firstElementChild.classList.add('animated', 'slideInUp')
    this._panel.firstElementChild.classList.remove('slideOutDown')
    document.body.appendChild(this._panel)

    this.emit('xconsole:show')
  }

  _hidePanel () {
    if (this._panel) {
      // mask animation
      this._panel.firstElementChild.classList.remove('slideInUp')
      this._panel.firstElementChild.classList.add('slideOutDown')
      this._panel.classList.remove('fadeIn')
      this._panel.classList.add('fadeOut')
      setTimeout(() => {
        document.body.removeChild(this._panel)
      }, 500)
    }

    this.emit('xconsole:hide')
  }

  _addPlugin (plugin) {
    if (!isObject(plugin)) {
      throw new TypeError('Invalid plugin:' + plugin)
    }
    this._initPlugin(plugin)
    this._plugins.push(plugin)
  }

  _initPlugin (plugin) {
    // All plugins hold instance of xConsole
    Object.defineProperty(plugin, 'xConsole', { value: this })

    // listen 'XConsoleShow' event
    this.on('xconsole:show', () => {
      if (isFunction(plugin.onXConsoleShow)) {
        setTimeout(() => plugin.onXConsoleShow(this), 0)
      }
    })

    // listen 'XConsoleHide' event
    this.on('xconsole:show', () => {
      if (isFunction(plugin.onXConsoleHide)) {
        setTimeout(() => plugin.onXConsoleHide(this), 0)
      }
    })

    // triggle 'init' event of plugin. Only triggle once
    if (isFunction(plugin.onInit)) {
      setTimeout(() => plugin.onInit(this), 0)
    }

    // triggle 'ready' event of plugin. Only triggle once
    window.addEventListener('DOMContentLoaded', () => {
      if (isFunction(plugin.onReady)) {
        setTimeout(() => plugin.onReady(this), 0)
      }
    })
  }
}

export default new XConsole()
