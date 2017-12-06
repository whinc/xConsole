import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error })
  }

  render () {
    const {hasError, error} = this.state
    if (hasError) {
      // You can render any custom fallback UI
      return <span style={{color: 'red'}}>{error ? String(error) : ''}</span>
    }
    return this.props.children
  }
}
