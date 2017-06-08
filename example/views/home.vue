<template>
  <div>
    <Provider :store="store">
      <write></write>
      <read></read>
    </Provider>
  </div>
</template>

<script>
  import write from '../component/write'
  import read from '../component/read'
  import store from '../store'

  export default {
    data () {
      return {
        store
      }
    },
    components: {
      write,
      read
    }
  }
</script>
