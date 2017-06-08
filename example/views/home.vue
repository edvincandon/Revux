<template>
  <div>
    <write></write>
    <read></read>
  </div>
</template>

<script>
  import write from '../component/write'
  import read from '../component/read'

  export default {
    components: {
      write,
      read
    }
  }
</script>
