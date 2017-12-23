
import React from 'react'
import PropTypes from 'prop-types'
import './SidePanel.css'

export default class SidePanel extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    entry: PropTypes.object.isRequired
  }

  constructor () {
    super(...arguments)
    this.state = {

    }
  }

  render () {
    const {onClose, entry} = this.props

    const general = {
      'Request URL': entry.url,
      'Request Method': entry.method,
      'Status Code': entry.status
    }
    return (
      <div className='SidePanel'>
        <div className='SidePanel__header'>
          <span onClick={onClose}>Close</span>
          <span>Headers</span>
        </div>
        <div className='SidePanel__content'>
          <p>General</p>
          {Object.keys(general).map(key =>
            <p key={key}>{`${key}: ${general[key]}`}</p>
          )}
        </div>
      </div>
    )
  }
}
