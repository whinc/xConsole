/*
 * Created by whincwu on 2017/10/28
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class Tab extends Component {
  static PropTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.element)
  }
  render () {
    return <div style={{ height: this.props._visible ? '80vh' : '0px', overflowY: 'auto' }}>
      {this.props.children}
    </div>
  }
}
