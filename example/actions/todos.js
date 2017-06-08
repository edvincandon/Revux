const ADD_TODO = 'ADD_TODO'
const ADDED_TODO = 'ADDED_TODO'
const ADDING_TODO = 'ADDING_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

export function addedTodo (text) {
  return {
    type: ADDED_TODO,
    text
  }
}

export function addingTodo () {
  return {
    type: ADDING_TODO
  }
}

export function toggleTodo (index) {
  return {
    type: TOGGLE_TODO,
    index
  }
}

export function addTodo (text) {
  return (dispatch, getState) => {
    dispatch(addingTodo())
    setTimeout(() => {
      dispatch(addedTodo(text))
    }, 1000)
  }
}
