interface XConsoleStatic {
  new (): XConsole
}

interface XConsole {
  on(eventName: string, handler: (value: any) => void): Disposable
  emit(eventName: string, value?: any = {}): void
}

interface Disposable {
  dispose(): void
}

declare var xConsole: XConsole