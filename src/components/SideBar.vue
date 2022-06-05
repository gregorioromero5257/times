<template>
  <div style="display: contents;">
    <div class="grid">
      <div class="img-content" @click="goToHome">
        <img src="assets/images/Menu-Envio.png" />
        <p class="font-size">Envío de informe</p>
      </div>
      <div class="img-content" @click="goToQuery" >
        <img src="assets/images/Menu-Revision.png"/>
        <p class="font-size">Revisión de registros</p>

      </div>
      <div class="img-content" @click="goToVacation">
        <img src="assets/images/Menu-Vacaciones.png"/>
        <p class="font-size">Vacaciones y ausencias</p>

      </div>

      <div class="img-content" v-if="userName == 2" @click="goToGeneralRegisters">
        <img src="assets/images/Menu-Admin.png"/>
        <p class="font-size">Administración</p>

      </div>

      <!-- <div class="img-content" v-if="userName == 2" @click="goToReportsGeneration">
        <img src="assets/images/generacion_reportes.png"/>
        <p class="font-size">Generación de reportes</p>
      </div> -->
    </div>

    <div style="padding : 5%;">
      <button @click="goToUsePolicy" class="btn btn-block btn-outline-secondary font-button"  style="white-space: normal;">
        Política de uso
      </button>
      <button @click="logout"  target="_blank"  class="btn btn-block btn-outline-secondary font-button"  style="white-space: normal;">
        Cerrar sesión
      </button>
      <br>
    </div>
  </div>

    <!-- <ul id="sidebar-menu">
      <li>
        <button  @click="goToHome" type="button" class="btn btn-block btn-lg btn-outline-secondary">
          <img class="icon-menu" src="assets/images/Google Calendar.png"/> Importación de Google Calendar
        </button>
      </li> -->
<!--      <li>
        <button @click="goToMonthlyReport" type="button" class="btn btn-block btn-lg btn-outline-secondary">
          <img class="icon-menu" src="assets/images/Cierre del informe.png"/> Cierre y envío de registros
        </button>
      </li>-->
      <!-- <li>
        <button @click="goToQuery" type="button" class="btn btn-block btn-lg btn-outline-secondary">
          <img class="icon-menu" src="assets/images/Consulta de registros.png"/> Consulta de registros cerrados
        </button>
      </li>
      <li>

        <button v-if="userName == 2" @click="goToGeneralRegisters" type="button" class="btn btn-block btn-lg btn-outline-secondary">
          <img class="icon-menu" src="assets/images/administracion.png"/> Administración
        </button>
      </li>
      <li>


        <button v-if="userName == 2" @click="goToReportsGeneration" type="button" class="btn btn-block btn-lg btn-outline-secondary">
          <img class="icon-menu" src="assets/images/generacion_reportes.png"/> Generación de reportes
        </button>


      </li>
    </ul> -->
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import MenuMixin from "@/mixin/MenuMixin";
@Component
export default class SideBar extends Mixins(MenuMixin) {
  goToUsePolicy(){
      this['$router'].replace("/use-policy");
  }

  async logout(){
    await this['$store'].dispatch('logout');
    this['$router'].replace("/login");
  }

  async mounted() {
      await this['$store'].dispatch("getUser").then(() => {
        this.userName = this['$store'].state.user.role_time_id;
      });
    this.showAdministrationMenu =  this.checkIfUserCanSeeAdministratorMenu();
  }
}
</script>
<style>
  #sidebar-menu{
    padding: 10px;
  }
  #sidebar-menu li{
    list-style: none;
    padding: 0;
    margin: 0;
    margin-bottom: 20px;
  }
  #sidebar-menu li button{
    font-size: 0.8em;
    padding-top: 15px;
    padding-bottom: 15px;
    text-align: left;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    text-align: -webkit-center;
  }

  .img-content {
    padding-left: 8%;
    padding-right: 6%;
    padding-top: 8%;
    padding-bottom: 0%;
    cursor: pointer;
  }

  .font-size {
    font-size: 0.7rem;
    font-weight: 600 !important;
  }

</style>
