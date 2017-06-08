
# Revue2 (WIP)
Inspired by Revue, use Redux with Vue.js seamlessly
> We were not satisfied with the way the original Revue worked internally.

> Basically, Revue2 works by referencing your redux store on your $root component. Revue2 provides a $connect method which is available on all Vue instances: it aims to make the use of redux with vuejs a little more like react-redux

# Installation
Install via NPM: `npm i --save revue2`

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
import store from './store'
import main from './main.vue'

Vue.use(Revue) // !!!

const app = new Vue({
  el: '#app',
  render: h => h(main)
})
```

**main.vue**

Use the Provider component from Revue2 and bind your redux store. The store will be provided to all children components.

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
