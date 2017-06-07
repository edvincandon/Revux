import Vue from 'vue'
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'

const store = createStore(reducers)

if (typeof __DEV__ !== 'undefined' && __DEV__) {
	window.store = store
}

export default store
