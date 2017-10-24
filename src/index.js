import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import XConsole from './XConsole'
import ConsolePlugin from './plugins/ConsolePlugin'
import NetworkPlugin from './plugins/NetworkPlugin'

let panel = null
let entry = null
let muiTheme = getMuiTheme({
  palette: {
  },
  button: {
    textTransform: 'none'
  }
})

if (!window.xConsole) {
  window.xConsole = new XConsole()
}

window.xConsole.addPlugin(new ConsolePlugin('xConsole:Console', 'Console'))
window.xConsole.addPlugin(new NetworkPlugin('xConsole:Network', 'Network'))

// addStylesheetStyle()

window.addEventListener('DOMContentLoaded', () => {
  window.xConsole.dispatchEvent({ type: 'ready' })
})

window.addEventListener('load', function () {
  showEntry()
})

function showEntry () {
  if (!entry) {
    entry = document.createElement('div')
    entry.classList.add('entry')
    ReactDOM.render(
      <button onClick={() => showPanel()}>xConsole</button>
      , entry)
  }
  document.body.appendChild(entry)
}

// function hideEntry () {
//   if (entry) {
//     document.body.removeChild(entry)
//   }
// }

function showPanel () {
  if (!panel) {
    panel = document.createElement('div')
    panel.classList.add('panel')
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        {window.xConsole.render({
          onClose: () => hidePanel()
        })}
      </MuiThemeProvider>
    , panel)
  }
  panel.classList.add('animated')
  panel.classList.remove('fadeOut')
  panel.classList.add('fadeIn')
  panel.firstElementChild.classList.add('animated')
  panel.firstElementChild.classList.remove('slideOutDown')
  panel.firstElementChild.classList.add('slideInUp')
  document.body.appendChild(panel)
}

function hidePanel () {
  if (panel) {
    panel.firstElementChild.classList.remove('slideInUp')
    panel.firstElementChild.classList.add('slideOutDown')
    panel.classList.remove('fadeIn')
    panel.classList.add('fadeOut')
    setTimeout(() => {
      document.body.removeChild(panel)
    }, 500)
  }
}

// 动态添加 CSS 样式表（嵌入式）
// function addStylesheetStyle () {
//   var style = document.createElement('style')
//   style.setAttribute('type', 'text/css')
//   style.innerHTML = '.animated{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes slideInUp{0%{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);visibility:visible}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}.slideInUp{-webkit-animation-name:slideInUp;animation-name:slideInUp}@-webkit-keyframes slideOutDown{0%{-webkit-transform:translateZ(0);transform:translateZ(0)}to{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}@keyframes slideOutDown{0%{-webkit-transform:translateZ(0);transform:translateZ(0)}to{visibility:hidden;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}}.slideOutDown{-webkit-animation-name:slideOutDown;animation-name:slideOutDown}'
//   document.head.appendChild(style)
// }
