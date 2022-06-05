
<template>

  <div class="grid-container" >
    <div class="grid-area-one" >
      <form style="background-color: #e9e9ee	; border-radius: 20px" class="pnew-4" v-on:keyup.enter="singIn">
        <div class="row text-center pb-4">
          <img style="width: 60%; margin: 0 auto" src="assets/images/LOGO MORADO.png" alt="">
        </div>
        <div style="text-align: center;" v-if="error">
          <small id="emailHelp" class="form-text text-danger mb-3"><strong>El email o la contraseña son incorrectos.</strong></small>
        </div>
        <div class="form-group">
          <label class="text-dark"><strong>Correo electrónico</strong></label>
          <input  v-on:keyup.enter="singIn" v-model="_data.email" autofocus type="email" class="form-control">
        </div>
        <div class="form-group">
          <label class="text-dark"><strong>Contraseña</strong></label>
          <input v-on:keyup.enter="singIn" v-model="_data.password" type="password" class="form-control">
        </div>
        <div class="form-group text-center">
          <template v-if="loading">
            <div id="loading"></div>
          </template>
          <template v-else>
            <button type="button" @click="singIn" class="btn btn-info pl-5 pr-5" style="background-color: #006560; border-radius: 10px; border-color: transparent">Iniciar sesión</button>
          </template>
        </div>
        <div class="form-group text-center">
          <a style="color: black" href="http://pgc.c-230.com/password/reset" class="input-font"><strong>¿Olvidaste tu contraseña?</strong></a>
        </div>
      </form>
    </div>
    <div class="grid-area-two" >
    </div>
  </div>

  <!-- <div class="row justify-content-center align-items-center" style="height: 100%">
    <div class="col col-sm-6 col-md-6 col-lg-6 col-xl-6">
    </div>
  </div> -->
</template>

<script lang="ts">
import { Component, Vue,  } from "vue-property-decorator";
import { FormLogin } from ".";
import axios from "axios";
import Proxy from "../../helpers/proxy";
axios.defaults.baseURL = Proxy.api.domain;
@Component
export default class Login extends Vue {
  error = false;
  loading = false;
  private _data!: FormLogin;
  API_Domain = Proxy.api.domain;
  async singIn() {
    try {
      this.loading = true;
      await this['$store'].dispatch("login", this._data);
      // this['$router'].replace("/use-policy");
      this['$router'].replace("/welcome");
      this.loading = false;
    } catch (error) {
      console.log("hay un error");
      this.loading = false;
      this.error = true;
    }
  }
  async created() {
    this._data.email = "";
    this._data.password = "";
  }
}
</script>

<style>



  body, html {
    background-image: url("../../../public/assets/images/login.png");
    background-position: center right;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
  }

  #app{
    height: 100%;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 40% 60%;
    padding-top: 6%;
  }

  .grid-area-one {
    padding-left: 10%;
    /* padding-bottom: 30% */
  }

  .pnew-4 {
    padding: 4rem !important;
  }

  @media (max-width: 992px) {
    .grid-container {
      grid-template-columns: 50% 50%;
    }

    .grid-area-one {
      padding-left: 0;
    }
  }

  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: 100%;
    }

    .grid-area-one {
      padding-left: 0;
    }
  }
</style>
