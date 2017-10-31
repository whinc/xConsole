import XConsole from './XConsole'

if (!window.XConsole) {
  window.XConsole = XConsole
}

// development mode
if (window.location.hostname === 'localhost') {
  new XConsole()
}

export default XConsole
