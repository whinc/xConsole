import React from 'react'
import './NetworkPanel.css'
import {Table, SidePanel} from './components'

export default class NetworkPluginPanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      /**
       * 请求信息
       * @type {{[id: string]: {id: string, url: string, method: string, status: number}}}
       */
      requestMap: props.requestMap || {},
      selectedEntry: null,
      isSidePanelOpen: false
    }
  }

  closeSidePanel () {
    this.setState({
      isSidePanelOpen: false,
      selectedEntry: null
    })
  }

  openSidePanel (entry) {
    this.setState({
      isSidePanelOpen: true,
      selectedEntry: entry
    })
  }

  render () {
    const {requestMap, isSidePanelOpen, selectedEntry} = this.state

    return (
      <div className='NetworkPanel'>
        <Table
          entries={Object.keys(requestMap).map(key => requestMap[key])}
          onClickEntry={entry => this.openSidePanel(entry)}
        />
        {isSidePanelOpen &&
          <div className='NetworkPanel__detail' >
            <SidePanel
              entry={selectedEntry}
              onClose={() => this.closeSidePanel()}
            />
          </div>
        }
      </div>
    )
  }
}

/**
 * @typedef {{[id: string]: {id: string, url: string, method: string, status: number}}} RequestMap
 */
