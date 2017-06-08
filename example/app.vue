<template>
    <div id="appRoot">
        <router-view></router-view>
    </div>
</template>

<script>
export default {}
</script>
<style>
	body {
    font: 14px/1.4 Helvetica, serif;
  }
  #app {
    padding-top: 40px;
    max-width: 900px;
    margin: 0 auto;
  }
  .counter {
    text-align: center;
    border: none;
    background-color: #fff;
    font-size: 60px;
    display: block;
    width: 100%;
    padding: 30px 0;
    cursor: pointer;
  }
  .counter:hover {
    background-color: #f9f9f9;
  }
  .add,.input-todo {
    padding: 10px;
    border: 1px solid #e2e2e2;
    border-radius: 2px;
    background-color: #fff;
    font-size: 15px;
    margin-right: 10px;
    outline: none;
  }
  .input-todo:focus {
    border-color: #ccc;
  }
  .add {
    cursor: pointer;
  }
  .add:hover {
    background-color: #f9f9f9;
    border-color: #ccc;
  }
  .todos {
    list-style: none;
    padding-left: 0;
    margin: 0;
    border: 1px solid #e2e2e2;
    margin-top: 20px;
    border-radius: 2px;
  }
  .todo {
    padding: 10px;
    -webkit-user-select: none;
  }
  .todo:hover {
    cursor: pointer;
  }
  .todo:nth-child(2n) {
    background-color: #f9f9f9;
  }
  .todo.del {
    text-decoration: line-through;
    color: #C52727;
  }
  .read {
    padding-top: 39px;
  }
  .read, .write {
    float: left;
    width: calc(50% - 20px);
    padding-right: 20px;
  }
  .read .todos {
    background-color: #f9f9f9;
    color: #999;
    border-color: #eee;
  }
  .read .todos .todo {
    cursor: default;
  }
</style>
