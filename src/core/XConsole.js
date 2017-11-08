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
import CommandRegistry from './CommandRegistry'
import PluginManager from './PluginManager'

/**
 * Display xConsole panel
 *
 * Supported commands:
 * * 'xconsole:show'
 * * 'xconsole:hide'
 */
class XConsole {
  constructor () {
    this._isInit = false
    this._isDOMContentLoaded = false
    this._panel = null
    this._entry = null
    this._emitter = new Emitter()

    // Listen page event before xConsole initialize to avoid miss event
    window.document.addEventListener('DOMContentLoaded', event => {
      this._isDOMContentLoaded = true
      this.emit('xconsole:ready', event)
    })
  }

  get plugins () {
    return this._plugins || (this._plugins = new PluginManager())
  }

  get commands () {
    return this._commands || (this._commands = new CommandRegistry())
  }

  init () {
    if (this._isInit) {
      console.warn('XConsole has been initialized')
      return
    }

    this.plugins.onDidAddPlugin(plugin => this._initPlugin(plugin))
    this.plugins.add(new ConsolePlugin('xConsole:Console', 'Console'))
    this.plugins.add(new NetworkPlugin('xConsole:Network', 'Network'))

    this.commands.add('xconsole:show', () => this._showPanel())
    this.commands.add('xconsole:hide', () => this._hidePanel())

    this._showEntry()
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
          plugins={this.plugins.getAll()}
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

  _initPlugin (plugin) {
    // All plugins hold instance of xConsole
    Object.defineProperty(plugin, 'xConsole', { value: this })

    // listen 'XConsoleShow' event
    this.on('xconsole:show', () => {
      if (isFunction(plugin.onXConsoleShow)) {
        plugin.onXConsoleShow(this)
      }
    })

    // listen 'XConsoleHide' event
    this.on('xconsole:hide', () => {
      if (isFunction(plugin.onXConsoleHide)) {
        plugin.onXConsoleHide(this)
      }
    })

    // triggle 'init' event of plugin. Only triggle once
    if (isFunction(plugin.onInit)) {
      plugin.onInit(this)
    }

    // triggle 'ready' event of plugin. Only triggle once
    if (this._isDOMContentLoaded) {
      if (isFunction(plugin.onReady)) {
        plugin.onReady(this)
      }
    } else {
      this.on('xconsole:ready', () => {
        if (isFunction(plugin.onReady)) {
          plugin.onReady(this)
        }
      })
    }
  }
}

export default new XConsole()
