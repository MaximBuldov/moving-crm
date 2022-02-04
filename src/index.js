import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter as Router} from "react-router-dom"
import { Provider } from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import App from './App'
import {Layout} from "antd"
import store, {persistor} from "./store/store"

import 'antd/dist/antd.css'
import './index.css'



ReactDOM.render(
    <Router>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <Layout className="main">
                    <App />
                </Layout>
            </PersistGate>
        </Provider>
    </Router>,
    document.getElementById('root')
);