import {Emitter} from 'event-kit'

export default class CommandRegistry {
  constructor () {
    this._commands = new Emitter()
  }

  add (commandName, listener) {
    this._commands.on(commandName, listener)
  }

  dispatch (commandName, value) {
    return this._commands.emit(commandName, value)
  }
}
