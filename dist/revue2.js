(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('redux')) :
	typeof define === 'function' && define.amd ? define(['redux'], factory) :
	(global.Revue2 = factory(global.redux));
}(this, (function (redux) { 'use strict';

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

const wrapActionCreators = (actionCreators) =>
  dispatch => redux.bindActionCreators(actionCreators, dispatch);

/**
 * Extend Vue prototype + global mixin
 *
 * @param {Vue} Vue
 */

function extendVue(Vue) {
  Vue.mixin({
    beforeDestroy() {
      if (this._unsubscribe) {
        this._unsubscribe();
      }
    }
  });
  Vue.prototype.$connect = function(mapState, mapDispatch) {
    const vm = this;
    const getMappedState = (state = this.$store.state) => mapState(state);

    const actions = wrapActionCreators(mapDispatch)(this.$store.dispatch);
    Object.keys(actions).forEach(key => {
      vm[key] = actions[key];
    });

    const observeStore = (store, currState, select, onChange) => {
      if (typeof onChange !== 'function') return null
      let currentState = currState || {};

      function handleChange() {
        const nextState = select(store.state);
        if (!shallowEqual(currentState, nextState)) {
          const previousState = currentState;
          currentState = nextState;
          onChange(currentState, previousState);
        }
      }

      handleChange();
      return store.subscribe(handleChange)
    };

    this._unsubscribe = observeStore(this.$store, getMappedState(), getMappedState, (newState, oldState) => {
      Object.keys(newState).forEach(key => {
        if(vm[key] === undefined) {
          console.warn(`[revue2] - you forgot to declare property **${key}** in your component's data function making it unreactive`);
        }

        vm.$set(vm, key, newState[key]);
      });
    });
  };

  Object.defineProperty(Vue.prototype, '$store', {
    get: function $store() {
      if (!this.$root.store) {
        throw new Error('[revue2] - No store provided to root component')
      }
      return this.$root.store
    }
  });
}

class Revue {
  constructor(reduxStore, options) {
    if (!options.component) {
      throw new Error('[revue2] - You must provide an entry point component')
    }

    this.store = reduxStore;
    this.subscribe = this.subscribe.bind(this);

    const revueInstance = this;

    this.Provider = {
      render: h => h(options.component),
      data: function() {
        return Object.assign({}, {
          store: revueInstance
        }, options.data)
      }
    };
  }
  subscribe(cb) {
    this.store.subscribe(cb);
  }
	get dispatch() {
		return this.store.dispatch
	}
  get state() {
    return this.store.getState()
  }
}

Revue.install = (_Vue) =>	{ extendVue(_Vue); };

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.use(RevueInstaller);
}

return Revue;

})));
//# sourceMappingURL=revue2.js.map
