
interface XConsole {
  init(): void
  readonly commands: CommandRegistry
  on(eventName: string, handler: (value: any) => void): Disposable
  emit(eventName: string, value?: any = {}): void
}

interface CommandRegistry {
  add (commandName: string, listener: (value: any) => void): Disposable
  dipatch (commandName, value?: any): void
}

interface Disposable {
  dispose(): void
}

declare var xConsole: XConsole