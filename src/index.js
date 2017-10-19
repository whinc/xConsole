import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton'
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

if (!window.XConsole) {
  window.XConsole = XConsole
}

const consolePlugin = {
  name: 'Console',
  component: ConsolePlugin
}
const networkPlugin = {
  name: 'Network',
  component: NetworkPlugin
}
XConsole.addPlugin(consolePlugin)
XConsole.addPlugin(networkPlugin)

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

function hideEntry () {
  if (entry) {
    document.body.removeChild(entry)
  }
}

function showPanel () {
  if (!panel) {
    panel = document.createElement('div')
    panel.style.cssText = `
      display: flex;
      flex-direction: column;
      position: absolute;
      z-index: 1000;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    `
    ReactDOM.render(
      <MuiThemeProvider muiTheme={muiTheme}>
        <XConsole
          plugins={XConsole.plugins}
          onClose={() => { hidePanel(showEntry) }}
        />
      </MuiThemeProvider>
    , panel)
  }
  panel.classList.add('animated')
  panel.classList.remove('slideOutDown')
  panel.classList.add('slideInUp')
  document.body.appendChild(panel)
}

function hidePanel (callback) {
  if (panel) {
    panel.classList.remove('slideInUp')
    panel.classList.add('slideOutDown')
    // setTimeout(() => {
    //   if (typeof callback === 'function') {
    //     callback()
    //   }
    //   document.body.removeChild(panel)
    // }, 400)
  }
}