
# Revue2
Based on Revue, use Redux with Vue.js seamlessly
> We were not satisfied with the way the original Revue worked internally
> Learn [Redux](http://redux.js.org/) before using Revue. That would help you get rid of JavaScript fatigue, sort of.

# Installation
Install via NPM: `npm i --save revue2`

# Getting started
> Work in Progress

**store.js**
Create your redux store:
```js
import {createStore} from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

export default store
```

**index.js**
Instantiate Revue2 as your root component
```js
import Vue from 'vue'
import Revue from 'revue2'
import store from './store'
import * as actions from './actions'
import main from './component.vue'

window.Vue = Vue;
// make sure Vue is in global scope

const { Provider } = new Revue(store, actions, {
  component: main,
  data: { api: player }
});

const app = new Vue(Provider).$mount('#target');
```

**component.vue**
Use the $connect method to map state to $data
```js
<template>{{status}}</template>

<script>
  export default {
    name: 'playButton',
    data () {
      return {
        status: null // define it to be reactive
      };
    },
    created () {
      this.$connect(state => {
        const { status } = state;
        return {
          status
        }
      });
    }
  }
</script>
```
