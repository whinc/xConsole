import {Emitter} from 'event-kit'
import {isObject} from '../utils'

export default class PluginManager {
  constructor () {
    this._plugins = []
    this._emmiter = new Emitter()
  }

  getAll () {
    return this._plugins
  }

  add (plugin) {
    if (!isObject(plugin)) {
      throw new TypeError('Invalid plugin:' + plugin)
    }

    this._plugins.push(plugin)

    this._emmiter.emit('did-add-plugin', plugin)
  }

  onDidAddPlugin (callback) {
    this._emmiter.on('did-add-plugin', callback)
  }
}
