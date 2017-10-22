import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
import xConsole from './xConsole'
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
  window.xConsole = xConsole
}

xConsole.addPlugin(new ConsolePlugin('xConsole:Console', 'Console'))
xConsole.addPlugin(new NetworkPlugin('xConsole:Network', 'Network'))

// addStylesheetStyle()

window.addEventListener('DOMContentLoaded', () => {
  xConsole.dispatchEvent({ type: 'ready' })
})

window.addEventListener('load', function () {
  showEntry()
})

function showEntry () {
  if (!entry) {
    entry = document.createElement('div')
    entry.style.cssText = `
      position: absolute;
      right: 0px;
      bottom: 0px;
      z-index: 900;
      margin-right: 10px;
      margin-bottom: 10px;
    `
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <RaisedButton label='xConsole' primary onClick={() => { showPanel() }} />
      </MuiThemeProvider>
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
    panel.style.cssText = `
      display: flex;
      flex-direction: column;
      position: absolute;
      background-color: rgba(0,0,0,.6);
      z-index: 1000;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    `
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        {xConsole.render({
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
