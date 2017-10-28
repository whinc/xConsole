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
  }

  // render plugin content. return dom element.
  render (xConsole) {
    console.log(`[${this.name}]Plugin#render() called`)
    return null
  }

  onEvent (xConsole, event) {
    if (typeof event !== 'object') {
      return
    }

    const methodName = 'on' + event.type[0].toUpperCase() + event.type.substr(1)
    if (typeof this[methodName] === 'function') {
      this[methodName](event, xConsole)
    } else {
      // this.print('onEvent() called')
    }
  }

  // Trigger before starting to initialize a plugin.
  // This event will only be trigger once.
  // Note that plugin's DOM is not ready now.
  onInit (xConsole) {
    console.log(`[${this.name}Plugin] onInit() called`)
  }

  // Trigger when all initialization is finished.
  // This event will only be triggered once.
  // Now plugin is installed and it's DOM is ready.
  onReady (xConsole) {
    console.log(`[${this.name}Plugin] onReady() called`)
  }

  onRemove () {
    // this.print('onRemove() called')
  }

  // on plugin tab became visible
  onShow () {
    // this.print('onShow() called')
  }

  // on plugin tab became invisible
  onHide () {
    // this.print('onHide() called')
  }

  onXConsoleShow () {
    // this.print('onXConsoleShow() called')
  }

  onXConsoleHide () {
    // this.print('onXConsoleHide() called')
  }
}
