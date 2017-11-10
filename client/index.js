import './index.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import store from './store'
import Routes from './routes'
import Translate from './components/translate'

// establishes socket connection
// import './socket'

ReactDOM.render(
  <Provider store={store}>
    <Translate />
  </Provider>,
  document.getElementById('app')
)
