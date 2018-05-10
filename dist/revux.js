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
      validator: function validator(store) {
        if (!store.dispatch && !store.subscribe && !store.getState) {
          throw new Error('[revux] - store provided is not a valid redux store');
        }
        return true;
      }
    }
  },
  provide: function provide() {
    return {
      $$store: this.store
    };
  },
  render: function render(h) {
    if (this.$slots.default.length > 1) {
      return h('div', this.$slots.default);
    }
    return this.$slots.default[0];
  }
};

function install(Vue) {
   Vue.component('Provider', Provider);
}

// Credit to React-Redux for this util function
// https://github.com/reactjs/react-redux/blob/573db0bfc8d1d50fdb6e2a98bd8a7d4675fecf11/src/utils/shallowEqual.js

var hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultMapState = function defaultMapState() {
  return {};
};
var defaultMapDispatch = {};

var normalizeMapState = function normalizeMapState(mapState) {
  if (typeof mapState === 'function') return mapState;

  if (mapState === Object(mapState)) {
    return function (state, ownProps) {
      return Object.keys(mapState).filter(function (key) {
        return typeof mapState[key] === 'function';
      }).reduce(function (map, key) {
        return _extends({}, map, _defineProperty({}, key, mapState[key](state, ownProps)));
      }, {});
    };
  }

  throw new Error('[revux] - mapState provided to connect is invalid');
};

var connector = function connector() {
  var _mapState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultMapState;

  var mapDispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultMapDispatch;
  return function (component) {
    var mapState = normalizeMapState(_mapState);

    return {
      name: 'connect-' + component.name,
      mixins: [component],
      inject: ['$$store'],

      data: function data() {
        var merged = _extends({}, mapState(this.$$store.getState(), this.$props || {}), redux.bindActionCreators(mapDispatch, this.$$store.dispatch));

        return Object.keys(merged).reduce(function (data, key) {
          return _extends({}, data, _defineProperty({}, key, merged[key]));
        }, {});
      },
      created: function created() {
        var _this = this;

        var getMappedState = function getMappedState(state) {
          return mapState(state, _this.$props || {});
        };

        var observeStore = function observeStore(store, select, onChange) {
          var currentState = select(store.getState());

          return store.subscribe(function () {
            var nextState = select(store.getState());
            if (!shallowEqual(currentState, nextState)) {
              var previousState = currentState;
              currentState = nextState;
              onChange(currentState, previousState);
            }
          });
        };

        this._unsubscribe = observeStore(this.$$store, getMappedState, function (newState, oldState) {
          Object.keys(newState).forEach(function (key) {
            _this.$set(_this, key, newState[key]);
          });
        });
      },
      beforeDestroy: function beforeDestroy() {
        this._unsubscribe();
      }
    };
  };
};

/**
* Revux
* Edvin CANDON <edvincandon@gmail.com>
*/

var revux = {
  install: function install$$1(_vue) {
    install(_vue);
  }
};

var connect = connector;
var provider = Provider;

exports['default'] = revux;
exports.connect = connect;
exports.provider = provider;

Object.defineProperty(exports, '__esModule', { value: true });

})));
