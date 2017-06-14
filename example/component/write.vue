<template>
  <div class="write">
    <input type="text" class="input-todo" v-model="todo"><button class="add" @click="addTodo()">add todo</button>
    <h2>Writable todos</h2>
    {{ isPosting ? 'Posting...' : '' }}
    <ul class="todos" v-if="items && items.length > 0">
      <li class="todo" :class="{del: todo.done}" v-for="(todo, index) in items" key="$index" v-text="todo.text" @click="toggleTodo(index)"></li>
    </ul>
  </div>
</template>

<script>
  import { connect } from '../../src/index'
  import {
    addTodo as addTodoAction,
    toggleTodo as toggleTodoAction
  } from '../actions/todos'

  const write = {
    data () {
      return {
        todo: ''
      }
    },
    methods: {
      toggleTodo (index) {
        this.toggleTodoAction(index)
      },
      addTodo (todo = this.todo) {
        if (!todo)
          return
        this.addTodoAction(todo)
        this.todo = ''
      },
    }
  }

  const mapState = state => {
    const { items, isPosting } = state.todos
    return {
      items,
      isPosting
    }
  }

  const mapDispatch = { addTodoAction, toggleTodoAction }

  export default connect(mapState, mapDispatch)(write)
</script>
