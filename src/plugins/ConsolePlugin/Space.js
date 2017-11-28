import React from 'react'
import PropTypes from 'prop-types'

export default class Space extends React.Component {
  static PropTypes = {
    count: PropTypes.number
  }

  static defaultProps = {
    count: 1
  }

  render () {
    const {count} = this.props
    return (
      <span style={{ whiteSpace: 'pre' }}>
        {' '.repeat(count)}
      </span>
    )
  }
}
