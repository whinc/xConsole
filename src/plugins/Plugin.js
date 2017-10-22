/*
 * Created by whincwu on 20171018
 */

/**
 * Base plugin class
 *
 * @export
 * @class Plugin
 */
export default class Plugin {
  constructor (id, name) {
    this.id = id
    this.name = name
    this.xConsole = null  // injected by xConsole
  }

  // render plugin content. return dom element.
  render () {
    console.log('Plugin#renderPlugin() called')
  }

  onEvent (event, xConsole) {
    if (typeof event !== 'object') {
      return
    }

    const methodName = 'on' + event.type[0].toUpperCase() + event.type.substr(1)
    if (typeof this[methodName] === 'function') {
      this[methodName](event, xConsole)
    } else {
      this.print('onEvent() called')
    }
  }

  print (text) {
    const log = this.xConsole ? this.xConsole.console.log : window.console.log
    log(`[${this.name}Plugin] ${text}`)
  }

  // Trigger before starting to initialize a plugin.
  // This event will only be trigger once.
  // Note that plugin's DOM is not ready now.
  onInit () {
    this.print('onInit() called')
  }

  // Trigger when all initialization is finished.
  // This event will only be triggered once.
  // Now plugin is installed and it's DOM is ready.
  onReady () {
    this.print('onReady() called')
  }

  onRemove () {
    this.print('onRemove() called')
  }

  // on plugin tab became visible
  onShow () {
    this.print('onShow() called')
  }

  // on plugin tab became invisible
  onHide () {
    this.print('onHide() called')
  }

  onXConsoleShow () {
    this.print('onXConsoleShow() called')
  }

  onXConsoleHide () {
    this.print('onXConsoleHide() called')
  }
}
