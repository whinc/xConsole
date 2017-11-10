import React from 'react'
import PropTypes from 'prop-types'
import './MessageBox.css'

/**
 * Display a message which may includes one line or multi-line
 */
export default class MessageBox extends React.Component {
  static PropTypes = {
    message: PropTypes.shape({
      id: PropTypes.string,
      level: PropTypes.oneOf(['log', 'warn', 'info', 'error', 'debug']),
      texts: PropTypes.arrayOf(PropTypes.any),
      timestamp: PropTypes.number
    })
  }

  formatDate (timestamp) {
    const align = (input, length = 2) => {
      input = String(input)
      if (input.length < length) {
        return '0'.repeat(length - input.length) + input
      } else {
        return input
      }
    }
    const d = new Date(timestamp)
    return align(d.getHours()) + ':' + align(d.getMinutes()) + ':' + align(d.getSeconds()) + '.' + align(d.getMilliseconds(), 3)
  }

  render () {
    const {
      message: { level, texts, timestamp }
    } = this.props
    return (
      <div className={`MessageBox MessageBox--${level}`}>
        <span className='MessageBox__timestamp'>{this.formatDate(timestamp)}</span>
        {' '}
        <span>{texts.join(' ')}</span>
      </div>
    )
  }
}
