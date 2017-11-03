import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (callback) {
    setTimeout(callback)
  }
}

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>,
  div)
})
