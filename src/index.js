import React from 'react'
import ReactDOM from 'react-dom'
import xConsole from './core/XConsole'
import 'font-awesome/css/font-awesome.min.css'
import './index.css'

if (!window.xConsole) {
  window.xConsole = xConsole
}

if (!window.React) {
  window.React = React
}

if (!window.ReactDOM) {
  window.ReactDOM = ReactDOM
}

export default xConsole
