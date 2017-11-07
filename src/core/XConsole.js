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
    this.panel = null
    this.entry = null
    this.plugins = []
    this._emitter = new Emitter()
  }

  init () {
    this.showEntry()
    this.addPlugin(new ConsolePlugin('xConsole:Console', 'Console'))
    this.addPlugin(new NetworkPlugin('xConsole:Network', 'Network'))
    // this.addPlugin({
    //   id: 'xConsole:Storage',
    //   name: 'Storage',
    //   render () {
    //     return <p>Storage</p>
    //   }
    // })
  }

  showEntry () {
    if (!this.entry) {
      this.entry = document.createElement('div')
      this.entry.classList.add('entry')
      ReactDOM.render(
        <button onClick={() => this.showPanel()}>xConsole</button>
        , this.entry)
    }
    document.body.appendChild(this.entry)
  }

  hideEntry () {
    if (this.entry) {
      document.body.removeChild(this.entry)
    }
  }

  showPanel () {
    if (!this.panel) {
      this.panel = document.createElement('div')
      this.panel.classList.add('panel')
      ReactDOM.render(
        <XConsoleView
          plugins={this.getPlugins()}
          onClose={() => this.hidePanel()}
        />
        , this.panel)
    }
    // mask animation
    this.panel.classList.add('animated', 'fadeIn')
    this.panel.classList.remove('fadeOut')
    // panel animation
    this.panel.firstElementChild.classList.add('animated', 'slideInUp')
    this.panel.firstElementChild.classList.remove('slideOutDown')
    document.body.appendChild(this.panel)

    this.emit('xconsole:show')
  }

  hidePanel () {
    if (this.panel) {
      // mask animation
      this.panel.firstElementChild.classList.remove('slideInUp')
      this.panel.firstElementChild.classList.add('slideOutDown')
      this.panel.classList.remove('fadeIn')
      this.panel.classList.add('fadeOut')
      setTimeout(() => {
        document.body.removeChild(this.panel)
      }, 500)
    }

    this.emit('xconsole:hide')
  }

  getPlugins () {
    return this.plugins
  }

  addPlugin (plugin) {
    if (!isObject(plugin)) {
      throw new TypeError('Invalid plugin:' + plugin)
    }
    this.initPlugin(plugin)
    this.plugins.push(plugin)
  }

  initPlugin (plugin) {
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
}

export default new XConsole()
