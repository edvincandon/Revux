(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux')) :
	typeof define === 'function' && define.amd ? define(['exports', 'redux'], factory) :
	(factory((global.revux = global.revux || {}),global.redux));
}(this, (function (exports,redux) { 'use strict';

var Provider = {
  name: 'Provider',
  props: {
    store: {
      type: Object,
      required: true,
      validator: function (store) {
        if (!store.dispatch && !store.subscribe && !store.getState) {
          throw new Error('[revux] - store provided is not a valid redux store')
        }
        return true
      }
    }
  },
  provide () {
    return {
      $$store: this.store
    }
  },
  render(h) {
    if (this.$slots.default.length > 1) {
      return h('div', this.$slots.default)
    }
    return this.$slots.default[0]
  }
};

function install(Vue) {
   Vue.component('Provider', Provider);
}

const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

const wrapActionCreators = (actionCreators) => dispatch => redux.bindActionCreators(actionCreators, dispatch);

const defaultMapState = () => ({});
const defaultMapDispatch = {};

const connector = (mapState = defaultMapState, mapDispatch = defaultMapDispatch) => component => {
  return {
    mixins: [component],
    inject: ['$$store'],

    data () {
      const initData = {};
      const state = mapState(this.$$store.getState());
      const actions = wrapActionCreators(mapDispatch)(this.$$store.dispatch);

      Object.keys(state).forEach(key => {
        initData[key] = state[key];
      });

      Object.keys(actions).map(key => {
        if (key in initData) {
          console.warn(`[revux] - ${key} already defined in mapState`);
          return
        }
        initData[key] = actions[key];
      });

      return initData
    },

    created () {
      const vm = this;
      const __store__ = this.$$store;
      const getMappedState = (state = __store__.getState()) => mapState(state);

      const observeStore = (store, currState, select, onChange) => {
        let currentState = currState;

        function handleChange() {
          const nextState = select(store.getState());
          if (!shallowEqual(currentState, nextState)) {
            const previousState = currentState;
            currentState = nextState;
            onChange(currentState, previousState);
          }
        }

        return store.subscribe(handleChange)
      };

      this._unsubscribe = observeStore(__store__, getMappedState(), getMappedState, (newState, oldState) => {
        Object.keys(newState).forEach(key => {
          vm.$set(this, key, newState[key]);
        });
      });
    },

    beforeDestroy() {
      this._unsubscribe();
    }
  }
};

const revux = {
  install(_vue) {
    install(_vue);
  }
};

const connect = connector;

exports['default'] = revux;
exports.connect = connect;

Object.defineProperty(exports, '__esModule', { value: true });

})));
