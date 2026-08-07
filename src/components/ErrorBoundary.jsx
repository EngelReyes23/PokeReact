import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError (error) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch (error, errorInfo) {
    console.error('Error capturado por el ErrorBoundary:', error, errorInfo)
  }

  render () {
    if (this.state.hasError) {
      return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
          <div className='w-full max-w-md rounded-xl bg-white p-6 text-center shadow-2xl dark:bg-gray-800'>
            <p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
              Ups, algo salió mal.
            </p>
            <p className='mt-2 break-words text-sm text-gray-500 dark:text-gray-400'>
              {this.state.message}
            </p>
            <button
              type='button'
              onClick={() => this.setState({ hasError: false, message: null })}
              className='mt-4 rounded-lg bg-purple-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-purple-600'
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
