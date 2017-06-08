import Vue from 'vue'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(
   applyMiddleware(thunk)
));

if (typeof __DEV__ !== 'undefined' && __DEV__) {
	window.store = store
}

export default store
