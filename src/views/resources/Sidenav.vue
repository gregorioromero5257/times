<template>
  <div id="nav">
    <router-link to="/index">Registro de tiempos</router-link>|
    <router-link to="/reports">Reportes</router-link>
    <template v-if="$store.state.auth">
      <span>Bienvenido {{$store.state.user.name}}</span>|
      <button class="btn btn-success" @click="logout">Logout</button>
    </template>
    <template v-else>
      <router-link to="/login">Login</router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue,Prop } from "vue-property-decorator";
import { User} from '../../helpers/interfaces/UserInterface';

@Component
export default class Sidenav extends Vue {
@Prop({type: Object , required: false}) private user!: User | undefined | null;

  async logout(){
    await this.$store.dispatch('logout');
    return this.$router.replace('/login');
  }
  
  get userName(){
      this.user = this.$store.state.user.name;
      return this.user;
  }
}
</script>