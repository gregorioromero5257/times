<template>
  <div class="container-home-dos " >
    <!-- <div class="row"> -->
      <!-- <div class="col-lg-12 col-md-12"> -->
        <div class="card p-lr" >
          <h1 class="title-home">
            <a class="title-admin" @click="type = '';">Administración</a>
            <template v-if="$route.fullPath === '/administration?detail'">

          <b>  {{type === '' ? ''
            : type === types.reportsgeneration ? '> Reportes recibidos'
            : type === types.users ? '> Revisión detallada'
            : type === types.vacation ? '> Vacaciones y ausencias'
            : type === types.timesheet ? '> TimeSheets'
            : '' }}</b>
          </template>
          </h1>
          <div class="grid-cards-admin" v-show="type === '' || $route.fullPath != '/administration?detail'">
            <div class="card card-shadow" @click="setType(types.reportsgeneration)" style="cursor: pointer;">
              <div class="card-body" >
                <hr class="hr">
                <div class="card-contain">
                  <p class="p-admin">INFORMES RECIBIDOS</p>
                  <img src="assets/images/Informes recibidos.png" class="img-admin"/>

                </div>
              </div>
            </div>
            <div class="card card-shadow" @click="setType(types.users)" style="cursor: pointer;">
              <div class="card-body" >
                <hr class="hr">
                <div class="card-contain">
                  <p class="p-admin">REVISIÓN DETALLADA</p>
                  <img src="assets/images/Revision detallada.png" class="img-admin"/>

                </div>
              </div>
            </div>
            <div class="card card-shadow" @click="setType(types.vacation)" style="cursor: pointer;">
              <div class="card-body" >
                <hr class="hr">
                <div class="card-contain">
                  <p class="p-admin" >VACACIONES Y AUSENCIAS</p>
                  <img src="assets/images/Vacaciones.png" class="img-admin"/>

                </div>
              </div>
            </div>
            <div class="card card-shadow" @click="setType(types.timesheet)" style="cursor: pointer;">
              <div class="card-body" >
                <hr class="hr">
                <div class="card-contain">
                  <p class="p-admin">TIMESHEETS</p>
                  <img src="assets/images/TimeSheets.png" class="img-admin"/>

                </div>
              </div>
            </div>
          </div>
          <!-- <div class="row">
            <div class="col-md-3">
              <a class="btn btn-block btn-custom-warning" @click="setType(types.users)">Registros por colaborador</a>
            </div>
            <div class="col-md-3">
              <a class="btn btn-block btn-custom-warning" @click="setType(types.projects)">Registros por actividad</a>
            </div>
            <div class="col-md-3">
              <a class="btn btn-block btn-custom-warning" @click="setType(types.general)">Registros generales</a>
            </div>
            <div class="col-md-3">
              <a class="btn btn-block btn-custom-warning" @click="setType(types.reports)">Reportes</a>
            </div>
          </div> -->
          <div class="card-body card-shadow mt-4" v-show="type != '' && type != types.reportsgeneration && $route.fullPath === '/administration?detail'">
            <general-registers v-if="type === types.general"></general-registers>
            <project-registers v-if="type === types.projects"></project-registers>
            <users-registers v-if="type === types.users"></users-registers>
            <reports-register v-if="type === types.reports"></reports-register>
            <vacation v-if="type === types.vacation"></vacation>
            <vacation v-if="type === types.timesheet"></vacation>
          </div>


        </div>
        <div class="bg-admin" v-if="type === ''">
        </div>
        <div v-show="$route.fullPath === '/administration?detail'">
          <reports-generation v-if="type === types.reportsgeneration"></reports-generation>
        </div>
      <!-- </div> -->
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import { Component,  Vue} from "vue-property-decorator";
import GeneralRegisters from "@/views/GeneralRegisters.vue";
import UsersRegisters from "@/views/UserRegisters.vue";
import ProjectRegisters from "@/views/ProjectRegisters.vue";
import ReportsRegister from "@/views/ReportsRegister.vue";
import ReportsGeneration from "@/views/ReportsGeneration.vue";
import Vacation from "@/views/AdminVacation.vue";

@Component({
  components: {ReportsRegister, ProjectRegisters, GeneralRegisters, UsersRegisters, ReportsGeneration, Vacation }
})
export default class Administration extends Vue{
  private types = {
    general : "general",
    users : "users",
    projects : "projects",
    reports: "reports",
    reportsgeneration: "reportsgeneration",
    vacation: "vacation",
    timesheet: "timesheet"
   };
  private type = '';

  goToReportsGeneration(){
      this['$router'].replace("/reports-generation");
  }

  private setType(type: string){

    this['$router'].replace("/administration?detail");
    this.type =  type;
  }
}
</script>

<style scoped>
 .btn-custom-warning{
   border: 2px solid #F5B133 !important;
   color: #F5B133 !important;
   border-radius: 10px !important;
   font-weight: bold;
   padding-top: 5px;
   padding-bottom: 3px;
   margin: 2px;
 }

 .btn-custom-warning:hover {
   background-color: #434B54;
 }

 .grid-cards-admin {
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap : 1em;
 }

 .hr {
   margin-top: 2%;
   margin-bottom: 2%;
   background: #000000;
 }

 .p-admin {
   font-size: 1em;
   font-weight: 600;
   color: #27282a;
 }

 .img-admin {
   width: 5.2rem;
   padding: 2%;
 }

 .card-contain {
   display: flex;
   /* justify-content: space-between; */
   flex-direction: column;
   text-align : start;
   height: 100%;
 }

 .p-lr {
   padding-left: 4%;
   padding-right: 4%;
 }

 a {
   color: #6C757D !important;
 }

 a:hover {
   color: #6C757D !important;
 }

 .bg-admin {
   background-image: url("/assets/images/Image.png");
   background-repeat: no-repeat;
   background-position: 24em top;
   height: 76vh;
 }

 .title-admin {
   font-weight: 500;
 }

 .title-admin:hover {
   text-decoration: underline;
 }

 @media (min-width: 1025px) and (max-width: 1200px) {
   .bg-admin {
     background-position: 18em top;
     height: 74vh;
   }
 }

 @media (min-width: 769px) and (max-width: 1024px) {
   .bg-admin {
     background-position: 6em top;
     height: 74vh;
   }
 }

 @media (max-width: 768px) {
   .bg-admin {
     background-position: -6em top;
     height: 74vh;
   }

   .grid-cards-admin {
     grid-template-columns: repeat(2, 1fr);
   }
 }

</style>
