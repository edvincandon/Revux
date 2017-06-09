
# Vuedux
Inspired by Revue, use Redux with Vue.js seamlessly
> We were not satisfied with the way the original Revue worked internally.

> Basically, Vuedux works by referencing your redux store on a Provider component. Every child component of the Provider will be able to access the store via a $connect method available on all Vue instances: it aims to make the use of redux with vuejs a little more like react-redux

# Installation
Install via NPM: `npm i --save vuedux`

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
import Vuedux from 'vuedux'
import store from './store'
import main from './main.vue'

Vue.use(Vuedux) // !!!

const app = new Vue({
  el: '#app',
  render: h => h(main)
})
```

**main.vue**

Use the Provider component from Vuedux and bind your redux store. The store will be provided to all children components.

```js
<template>
    <Provider :store="store">
      <connectedComponent></connectedComponent>
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

Use the `$connect` method to map state to $data and map actions to dispatch.
Here our state looks something like `{ status: 'foobar' }`

**Be sure to declare your mapped $data properties in your component's data definition for them to be reactive**

```js
<template>{{status}}</template>

<script>
  import { createAction } from './actions'
  // createAction is an action creator of type () => ({type: 'ACTION_CREATED'})

  const mapState = state => {
    const { status } = state // deeply nested state support as well
    return {
      status // must match data property
    }
  })

  const mapDispatch = { createAction } // will be added to vm instance

  export default {
    data () {
      return {
        status: null // define it to be reactive
      }
    },
    created () {
      this.$connect(mapState, mapDispatch)
    }
    methods: {
      doMagic: function () {
        this.createAction() // thanks to $connect
      }
    }
  }
</script>
```
