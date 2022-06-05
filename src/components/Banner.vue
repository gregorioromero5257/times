<template>
  <nav id="navbar-image" class="navbar navbar-expand-lg">
    <div class="container-fluid">
<!--      <h4 class="text-white">¡Bienvenido(a)  a TimeWorks, {{ userName }} !</h4>-->
    </div>
  </nav>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Banner extends Vue {
  userName = "";
  async mounted() {
    this['$store'].dispatch("getUser").then(() => {
      this.userName = this['$store'].state.user.name;
    });
  }
}
</script>
<style scoped>
</style>
