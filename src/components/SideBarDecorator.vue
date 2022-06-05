<template>
  <aside class="left-sidebar">
    <div class="yellow-div"></div>
    <div class="orange-div"></div>
    <div class="blue-div"></div>
    <div class="scroll-sidebar"></div>
  </aside>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class SideBarDecorator extends Vue {
  created() {
    console.log("Se creo navbar");
  }
}
</script>
<style>
.yellow-div{
  background: #F7B500;
  width: 15px;
  height: 25%;
  margin-top: -150px;
  margin-left: 291px;
}
.orange-div{
  background: #FA6400;
  width: 15px;
  height: 40%;
  margin-top: 20px;
  margin-left: 291px
}
.blue-div{
  background: #6236FF;
  width: 15px;
  height: 50%;
  margin-top: 20px;
  margin-left: 291px;
}
</style>