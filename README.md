
# revux
[![npm version](https://badge.fury.io/js/revux.svg)](https://badge.fury.io/js/revux)
[![Build Status](https://travis-ci.org/edvincandon/revux.svg?branch=master)](https://travis-ci.org/edvincandon/revux)
[![Coverage Status](https://coveralls.io/repos/github/edvincandon/revux/badge.svg?branch=master)](https://coveralls.io/github/edvincandon/revux?branch=master)

Inspired by Revue, use Redux with Vue.js seamlessly
> We were not satisfied with the way the original Revue worked internally.

> Basically, revux works by referencing your redux store on a Provider component. Every child component of the Provider will be able to access the store via a connect method: it aims to make the use of redux with vuejs a little more like react-redux

# Installation
Install via NPM: `npm i --save revux`

# Getting started
> For **Vue-Router integration**: check out the example folder

> More details coming soon

**store.js**

Create your redux store:
```js
import {createStore} from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

export default store
```

**index.js**

```js
import Vue from 'vue'
import revux from 'revux'
import main from './main.vue'

Vue.use(revux) // !!!

const app = new Vue({
  el: '#app',
  render: h => h(main)
})
```

**main.vue**

Use the Provider component from revux and bind your redux store. The store will be provided to all children components via vue's inject/provide mechanism.

```js
<template>
    <Provider :store="store">
      <connectedComponent>
      </connectedComponent>
    </Provider>
</template>

<script>
  import store from './store'
  import connectedComponent from './connectedComponent.vue'

  export default {
    data () {
      return {
        store
      }
    },
    components: {
      connectedComponent
    }
  }
</script>
```

**connectedComponent.vue**

Import the `connect` method from `revux` to map state and actions to your instance's data.
Here our state looks something like `{ status: 'foobar' }`

```js
<template>{{status}}</template>

<script>
  import { connect } from 'revux' // !!!
  import { createAction } from './actions'
  // createAction is an action creator of type () => ({type: 'ACTION_CREATED'})

  const component = {
    methods: {
      doMagic: function () {
        this.createAction()
      }
    }
  }

  const mapState = state => {
    const { status } = state
    return {
      status
    }
  })

  const mapDispatch = { createAction }

  export default connect(mapState, mapDispatch)(component)
</script>
```

**NB**
You can also pass an object to mapState.
Top-level object properties should be functions that get passed the state.

```js
  const mapState = {
    status: state => state.status
  }
```
