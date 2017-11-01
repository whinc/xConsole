/*
 * Created by whincwu on 2017/10
 */
import React from 'react'
import ReactDOM from 'react-dom'
import './XConsole.css'
import XConsoleView from './XConsoleView'
import Plugin from './plugins/Plugin'
import ConsolePlugin from './plugins/ConsolePlugin'
import NetworkPlugin from './plugins/NetworkPlugin'

class XConsole {
  constructor () {
    this.panel = null
    this.entry = null
    // Hold native console object
    this.console = this.hookConsole()
    this.eventListeners = {}
    this.plugins = []

    this.showEntry()

    this.addPlugin(new ConsolePlugin('xConsole:Console', 'Console'))
    this.addPlugin(new NetworkPlugin('xConsole:Network', 'Network'))
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
        <XConsoleView xConsole={this} onClose={() => this.hidePanel()} />
        , this.panel)
    }
    // mask animation
    this.panel.classList.add('animated', 'fadeIn')
    this.panel.classList.remove('fadeOut')
    // panel animation
    this.panel.firstElementChild.classList.add('animated', 'slideInUp')
    this.panel.firstElementChild.classList.remove('slideOutDown')
    document.body.appendChild(this.panel)

    this.dispatchEvent(this.createEvent('XConsoleShow'))
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

    this.dispatchEvent(this.createEvent('XConsoleHide'))
  }

  // Hook native console methods
  hookConsole () {
    const console = {}
    const names = ['log', 'info', 'error', 'warn', 'debug', 'clear']
    names.forEach(name => {
      console[name] = window.console[name]
      window.console[name] = (...args) => {
        let _level = name
        let _args = args
        if (name === 'clear') {
          _level = 'system'
          _args = ['Console was cleared']
        }
        this.dispatchEvent(this.createEvent('console', {level: _level, args: _args}))

        // call native console method
        console[name](...args)
      }
    })
    return console
  }

  getPlugins () {
    return this.plugins
  }

  addPlugin (plugin) {
    if (!(plugin instanceof Plugin)) {
      throw new TypeError('Invalid plugin type')
    }
    this.plugins.push(plugin)
    this.initPlugin(plugin)
  }

  initPlugin (plugin) {
    // listen 'console' event. 'console' event should listen early
    this.addEventListener('console', event => {
      if (typeof plugin.onEvent === 'function') {
        setTimeout(() => plugin.onEvent(this, event), 0)
      }
    })

    // listen 'XConsoleShow' event
    this.addEventListener('XConsoleShow', event => {
      if (typeof plugin.onXConsoleShow === 'function') {
        setTimeout(() => plugin.onXConsoleShow(this), 0)
      }
    })

    // listen 'XConsoleHide' event
    this.addEventListener('XConsoleHide', event => {
      if (typeof plugin.onXConsoleHide === 'function') {
        setTimeout(() => plugin.onXConsoleHide(this), 0)
      }
    })

    // triggle 'init' event of plugin. Only triggle once
    if (typeof plugin.onInit === 'function') {
      setTimeout(() => plugin.onInit(this), 0)
    }

    // triggle 'ready' event of plugin. Only triggle once
    window.addEventListener('DOMContentLoaded', () => {
      if (typeof plugin.onReady === 'function') {
        setTimeout(() => plugin.onReady(this), 0)
      }
    })
  }

  addEventListener (eventType, handler) {
    if (!this.eventListeners[eventType]) {
      this.eventListeners[eventType] = []
    }
    this.eventListeners[eventType].push(handler)
  }

  removeEventListener (eventType, hander) {
    if (this.eventListeners[eventType]) {
      const foundIndex = this.eventListeners[eventType].findIndex(v => v === hander)
      this.eventListeners[eventType].splice(foundIndex, 1)
    }
  }

  dispatchEvent (event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(handler => handler(event))
    }
  }

  createEvent (type, detail) {
    return {
      type: type,
      detail: {
        ...detail,
        timestamp: Date.now()
      }
    }
  }
}

export default XConsole
