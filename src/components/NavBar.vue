<template>
  <!-- Header section -->
  <div class="NavBars">
  <label for="menu-opener" class="OpenMenuButton">&#9776;</label>
  <input type="checkbox" data-menu="DrawerMenu" id="menu-opener">
  <aside class="DrawerMenu">
    <nav class="Menu">
      <div class="grid">
        <label for="menu-opener" class="img-content " @click="goToHome" >
          <img src="assets/images/Menu-Envio.png" />
          <p class="font-size">Envío de informe</p>
        </label>
        <label for="menu-opener" class="img-content" @click="goToQuery" >
          <img src="assets/images/Menu-Revision.png"/>
          <p class="font-size">Revisión de registros</p>

        </label>
        <!-- <label for="menu-opener" class="img-content" @click="goToVacation">
        <img src="assets/images/Menu-Vacaciones.png"/>
        <p class="font-size">Vacaciones y ausencias</p>

      </div> -->

      <label for="menu-opener" class="img-content" v-if="userName == 2" @click="goToGeneralRegisters">
        <img src="assets/images/Menu-Admin.png"/>
        <p class="font-size">Administración</p>

      </label>

      <label for="menu-opener" class="img-content" v-if="userName == 2" @click="goToReportsGeneration">
        <img src="assets/images/generacion_reportes.png"/>
        <p class="font-size">Generación de reportes</p>
      </label>
    </div>

    <div style="padding : 5%;">
      <label for="menu-opener" @click="goToUsePolicy" class="btn btn-block btn-outline-secondary font-button"  style="white-space: normal;">
        Política de uso
      </label>
      <button @click="logout"  target="_blank"  class="btn btn-block btn-outline-secondary font-button"  style="white-space: normal;">
        Cerrar sesión
      </button>
      <br>
    </div>
  </nav>
  <label for="menu-opener"></label>
</aside>
<img src="assets/images/LOGO BLANCO.png" class="img-size" @click="goToWelcome"/>
</div>


<!-- <nav class="navbar-new"> -->
<!-- NAVIGATION MENU -->
<!-- <ul class="nav-links">
<input type="checkbox" id="checkbox_toggle" />
<label for="checkbox_toggle" class="bars">&#9776;</label> -->
<!-- NAVIGATION MENUS -->
<!-- <div class="menu">
<li>
<button  @click="goToHome" type="button" class="btn btn-contents btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/Google Calendar.png"/> Importación de Google Calendar
</button>
</li>
<li>
<button  @click="goToMonthlyReport" type="button" class="btn btn-contents nav-button btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/Cierre del informe.png"/> Envío de informe mensual
</button>
</li>
<li>
<button  @click="goToQuery" type="button" class="btn btn-contents btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/Consulta de registros.png"/> Consulta de registros previos
</button>
</li>
<li v-if="userName == 2">
<button  @click="goToGeneralRegisters" type="button" class="btn btn-contents btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/administracion.png"/> Administración
</button>
</li>
<div class="footer-nav"> -->
<!-- <div class="footer"> -->
<!-- <a href="/use-policy" style="color:grey;font-size:0.7em;">Política y manual de uso</a> -->
<!-- <button type="button" @click="logout" class="btn btn-sm btn-outline-warning">Cerrar Sesión</button> -->
<!-- </div> -->
<!-- </div> -->

<!-- </div> -->
<!-- </ul> -->
<!-- LOGO -->
<!-- <div class="logo"> -->

<!-- </div> -->
<!-- </nav> -->

<!-- <nav class="navbar navbar-expand-lg navbar-dark bg-dark navbar-desktop" id="navbar-fixed">
<div class="row container-fluid">
<div class="col">
<span>
<img src="assets/images/LOGO BLANCO.png" style="max-width: 20%"/>
</span>
</div>
<div class="col text-right">
<button type="button" @click="logout" class="btn btn-sm btn-outline-warning">Cerrar Sesión</button>
</div>
</div>
</nav> -->

<!--<nav class="show-on-mobile">
<div class="row m-2">
<div class="col-6 pl-1 mb-2">
<button  @click="goToHome" type="button" class="btn btn-block btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/Google Calendar.png"/> Importación de Google Calendar
</button>
</div>
<div class="col-6 pl-1 mb-2">
<button  @click="goToMonthlyReport" type="button" class="btn btn-block nav-button btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/Cierre del informe.png"/> Envío de informe mensual
</button>
</div>
<div class="col-6 pl-1 mb-2">
<button  @click="goToQuery" type="button" class="btn btn-block btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/Consulta de registros.png"/> Consulta de registros previos
</button>
</div>
<div v-if="userName == 2" class="col-6 pl-1 mb-2">
<button  @click="goToGeneralRegisters" type="button" class="btn btn-block btn-lg btn-outline-secondary nav-button">
<img class="icon-menu" src="assets/images/administracion.png"/> Administración
</button>
</div>
</div>
</nav> -->
<!-- EndHeader section -->
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import MenuMixin from "@/mixin/MenuMixin";
import SideBar from '../components/SideBar.vue';


@Component({
  components: {
    SideBar
  }
})
export default class NavBar extends Mixins(MenuMixin) {
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
.footer-nav{
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  padding: 4% 0 0% 0;
}

.img-size {
  padding: 1%;
  max-width: 12%;
  cursor: pointer;
}

.NavBars {
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  padding-right: 2%;
  padding-top: 1%;
}

@media (min-width: 768px) {
  .OpenMenuButton {
    display: none;
  }

  .img-size {
    max-width: 12% !important;
  }
}

@media (max-width: 768px) {
  .img-size {
    max-width: 20% !important;
  }
}

</style>
<style media="screen">
.OpenMenuButton {
  cursor:pointer;
  font-size:1.8rem;
  font-weight:900;
  padding-left: 3%;
  color: #ffff;
  align-self : center;
  /* word-spacing:140%; */
  /* letter-spacing:4px; */
  /* display:flex; */
  /* justify-content:center; */
  margin-top:1%
}

.DrawerMenu {
  position:fixed;
  z-index:99;
  width:100vw;
  height:100vh;
  top:0;
  bottom:0;
  transform:translateX(-100%);
  transition:transform .5s cubic-bezier(0.4,0,.2,1);
  display:grid;
  grid-template-areas:'MENU OVERLAY';
  grid-template-columns:15fr 5fr
}

@media (min-width:30em) {
  .DrawerMenu {
    grid-template-columns:2fr 10fr;
  }
}

[data-menu]:checked~.DrawerMenu {
  transform:none;
}

.Menu {
  display:block;
  flex-flow:column wrap;
  transform:translateX(-30%);
  opacity:0;
  color:#fff;
  transition:all 500ms cubic-bezier(0.4,0,.2,1);
  transition-delay:0;
  contain:content;
  grid-area:'MENU';
  background: #f2f4f8;
  box-sizing:border-box;
  padding:2%;
  overflow:auto;
  -webkit-overflow-scrolling:touch
}

@media (min-width:30em) {
  .Menu {
    min-width:400px
  }
}

[data-menu]:checked~.DrawerMenu .Menu {
  transform:none;
  opacity:1;
  transition-delay:300ms
}

.Menu a {
  text-decoration:none;
  color:rgba(255,255,255,.50196);
  display:block;
  padding:16px 0;
}

.Menu a:hover {
  color:#69F0AE;
}

.Menu>*+* {
  border-top:1px solid rgba(255,255,255,.1);
}

.MenuOverlay {
  display:block;grid-area:'OVERLAY';
}

[data-menu]:not(:checked)~.DrawerMenu .MenuOverlay {
  pointer-events:none;
}


</style>
