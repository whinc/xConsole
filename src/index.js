import XConsole from './XConsole'

if (!window.XConsole) {
  window.XConsole = XConsole
  addCSSLink('https://unpkg.com/bulma@0.6/css/bulma.css')
}

// development mode
if (window.location.hostname === 'localhost') {
  new XConsole()
}

export default XConsole

function addCSSLink (url) {
  var link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('href', url)
  document.head.appendChild(link)
}
