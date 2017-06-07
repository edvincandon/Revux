(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Revue2 = factory());
}(this, (function () { 'use strict';

function shallowEqual(objA, objB) {
  if (objA === objB) return true;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
      objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

/**
 * Extend Vue prototype + global mixin
 *
 * @param {Vue} Vue
 */

function extendVue(Vue) {
  Vue.prototype.$connect = function(mapState) {
    const vm = this;
    const getMappedState = (state = this.$store.state) => mapState(state);

    const observeStore = (store, currState, select, onChange) => {
      if (typeof onChange !== 'function') return null;
      let currentState = currState || {};

      function handleChange() {
        const nextState = getMappedState();
        if (!shallowEqual(currentState, nextState)) {
          const previousState = currentState;
          currentState = nextState;
          onChange(currentState, previousState);
        }
      }

      const unsubscribe = store.subscribe(handleChange);
      handleChange();
      return unsubscribe
    };

    observeStore(this.$store, this.$store.state, getMappedState(), (newState, oldState) => {
      Object.keys(newState).forEach(key => {
        vm[key] = newState[key];
      });
    });
  };

  Object.defineProperty(Vue.prototype, '$store', {
    get: function $store() {
      if (!this.$root.store) {
        throw new Error('No store provided to root component')
      }
      return this.$root.store
    }
  });
}

const isDev = process.env.NODE_ENV !== 'production';

const RevueInstaller = {
  install(_Vue) {
    extendVue(_Vue);
  }
};

class Revue {
  constructor(reduxStore, reduxActions, options) {
    if (!options.component) {
      throw new Error('You must provide an entry point component to Revue')
    }

		if (typeof window !== 'undefined' && window.Vue) {
			const Vue = window.Vue;
			Vue.use(RevueInstaller);
		} else {
			throw new Error('Please load Vue before instanciating Revue');
		}
    // Apply global mixin and extend prototype

    this.store = reduxStore;
    this.subscribe = this.subscribe.bind(this);
    if (reduxActions) {
      this.reduxActions = reduxActions;
    }

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
  get state() {
    return this.store.getState()
  }
  get actions() {
    if (isDev && !this.reduxActions) {
      throw new Error('[Revue] Binding actions to Revue before calling them!')
    }
    return this.reduxActions
  }
  dispatch(...args) {
    return this.store.dispatch(...args)
  }
}

return Revue;

})));
//# sourceMappingURL=revue2.js.map
