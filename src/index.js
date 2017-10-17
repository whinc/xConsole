import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import App from './App'

var entry = document.createElement('div')
entry.style.cssText = `
  position: absolute;
  right: 0px;
  bottom: 0px;
  margin-right: 10px;
  margin-bottom: 10px;
`
ReactDOM.render(
  <MuiThemeProvider>
    <RaisedButton label='xConsole' primary onClick={showPanel} />
  </MuiThemeProvider>
  ,entry)

window.addEventListener('load', function () {
  document.body.appendChild(entry)
})

var panel = null

function showPanel () {
  if (!panel) {
    panel = document.createElement('div')
    panel.style.cssText = `
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
    `
    ReactDOM.render(
      <MuiThemeProvider>
        <App onClose={() => document.body.removeChild(panel)} />
      </MuiThemeProvider>
    , panel)
  }
  document.body.appendChild(panel)
}