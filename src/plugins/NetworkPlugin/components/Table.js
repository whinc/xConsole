import React from 'react'
import PropTypes from 'prop-types'
import './Table.css'

export default class Table extends React.Component {
  static propTyps = {
    entryies: PropTypes.arrayOf(PropTypes.any),
    // 点击条目的回调函数
    // enrty => void
    onClickEntry: PropTypes.func
  }

  static defaultProps = {
    entries: [],
    onClickEntry: () => {}
  }

  parseUrl (url) {
    if (typeof url !== 'string') return String(url)

    const lastSlashIndex = url.lastIndexOf('/')
    const name = url.substr(lastSlashIndex + 1)

    return {name}
  }

  render () {
    const {entries, onClickEntry} = this.props

    return (
      <div className='Table'>
        <div className='Table__header'>
          <span className='Table__item Table__item--grow'>
            Name{entries.length > 0 ? `(${entries.length})` : ''}
          </span>
          <span className='Table__item'>Method</span>
          <span className='Table__item'>Status</span>
        </div>
        <div className='Table__content'>
          {entries.map(entry => {
            const { name } = this.parseUrl(entry.url)
            return (
              <div className='Table__row' key={entry.id} onClick={() => onClickEntry(entry)}>
                <span className='Table__item Table__item--grow'>{name}</span>
                <span className='Table__item'>{entry.method}</span>
                <span className='Table__item'>{entry.status !== undefined ? entry.status : '--'}</span>
              </div>
            )
          })}
        </div>
      </div >
    )
  }
}
