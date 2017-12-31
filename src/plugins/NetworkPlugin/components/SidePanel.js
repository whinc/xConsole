
import React from 'react'
import PropTypes from 'prop-types'
import './SidePanel.css'
import {Space} from '../../components'

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
          <span className='fa fa-times' onClick={onClose} />
          <span>Headers</span>
        </div>
        <div className='SidePanel__content'>
          <p style={{fontWeight: 'bold', margin: 0}}>General</p>
          {Object.keys(general).map(key =>
            <p key={key} style={{margin: 0}}>
              <Space count={4} />
              <span style={{fontWeight: 'bold'}}>{key}:</span>
              <span>{general[key]}</span>
            </p>
          )}
        </div>
      </div>
    )
  }
}
