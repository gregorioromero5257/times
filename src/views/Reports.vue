<template>
     <div class="container">
       <!-- <highcharts :options="chartOptions"></highcharts> -->
        <highcharts  :options="chartOptions" ref="chart"></highcharts>
         <h1>Reportes</h1>
         <div class="row">
            <div class="col-lg-12">
              <br>
              <hr>
              <br>
            </div>
          </div>
         <div class="row">
            <div class="col-lg-12">
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
              <h4>Registros generales</h4>
            </div>
            <div class="col-lg-5"></div>

            <div class="col-lg-4"></div>
            <hr>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre del proyecto</th>
                    <th scope="col">Usuarios</th>
                    <th scope="col">Posición</th>
                    <th scope="col">Horas registradas</th>
                    <th scope="col">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(project, index) in ProjectsTime" :key='index'>
                      <td>{{project.project.name}}</td>
                      <td>{{project.user.name}}</td>
                      <td v-if="project.user.position">{{project.user.position.name}}</td>
                      <td v-else>Sin registro</td>
                      <td>{{project.hours}}</td>
                      <td>{{project.description}}</td>
                  </tr>
                </tbody>
                </table>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12">
              <br>
              <hr>
              <br>
            </div>
          </div>
          <div class="row">
              <div class="col-lg-3">
                <h4>Registros por proyecto</h4>
              </div>
              <div class="col-lg-5">
              </div>
              <div class="col-lg-4">
                <button class="btn btn-sm btn-success" @click="projectReport">
                Exportar 
                </button>
              </div>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <th scope="col">Nombre del proyecto</th>
                  <th scope="col">Horas totales</th>
                  <th> Detalles </th>
                </thead>
                <tbody v-for="(projectTotal, index) in projectsReport" :key='index'>
                  <tr  >
                    <td>{{ projectTotal.ProjectTimeworkUser.project.name}}</td>
                    <td>{{ projectTotal.hours_total}}</td>
                    <td> 
                      <button class="btn success"  
                      @click="detailProject(projectTotal.ProjectTimeworkUser.project_timework_id)"> 
                      Ver detalles {{projectTotal.ProjectTimeworkUser.project_timework_id}}</button> 
                    </td>
                  </tr>
                   <tr v-if="opened.includes(projectTotal.ProjectTimeworkUser.project_timework_id)" >
                     <td>Detalles</td>
                     <td colspan="3">
                     <table class="table">
                      <thead>
                        <th>Nombre del usuario</th>
                        <th>Posición</th>
                        <th> Horas registradas </th>
                        <th> Ver detalles</th>
                      </thead>
                      <tbody v-for="(detail, index) in details" :key='index'>
                        <tr >
                          <td>{{detail.ProjectTimeworkUser[0].user.name}}</td>
                          <td>{{detail.ProjectTimeworkUser[0].user.position.name}}</td>
                          <td>{{detail.hours_total}}</td>
                          <td><button class="btn btn-sm btn-success" @click="detailUser(detail.ProjectTimeworkUser[0].user.id,detail.ProjectTimeworkUser[0].project_timework_id)">
                            Ver mas</button></td>
                        </tr>
                        <tr v-if="userDetailControl.includes(detail.ProjectTimeworkUser[0].user.id)">
                          <td>Detalles</td>
                          <td colspan="1"></td>
                          <table class="table">
                            <thead>
                              <th>Horas destinadas</th>
                              <th>Actividad</th>
                            </thead>
                            <tbody >
                              <tr v-for="(userdetail,index) in userDetails" :key="index">
                                <td> {{userdetail.hours}} </td>
                                <td>{{userdetail.description}}</td>
                              </tr>
                            </tbody>
                          </table>
                        </tr>
                      </tbody>
                     </table>
                     </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from 'vue-property-decorator';
import Proxy from '../helpers/proxy';
import axios from 'axios';
import XLSX from 'xlsx';

@Component
export default class Reports extends Vue{

    API_Domain = Proxy.api.domain;
    ProjectsTime: Array<any>=[];
    projectsReport: Array<any>=[];
    opened: Array<number>=[];
    details: Array<any>=[];
    userDetailControl: Array<any> = [];
    userDetails: Array<any> = [];
   

    created() {
      this.projectTime();
      this.recordsbyProject();
    }
    get chartOptions(){
      const options = {
       chart: {
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 45
        }
    },
    title: {
        text: 'Contents of Highsoft\'s weekly fruit delivery'
    },
    subtitle: {
        text: '3D donut in Highcharts'
    },
    plotOptions: {
        pie: {
            innerSize: 100,
            depth: 45
        }
    },
    series: [{
        name: 'Delivered amount',
        data: [
            ['Bananas', 8],
            ['Kiwi', 3],
            ['Mixed nuts', 1],
            ['Oranges', 6],
            ['Apples', 8],
            ['Pears', 4],
            ['Clementines', 4],
            ['Reddish (bag)', 1],
            ['Grapes (bunch)', 1]
        ]
    }]
      }
      return options;
    }
    async detailUser(user: number,project: number){
      const index = this.userDetailControl.indexOf(user);
      const userDetail = await axios.get('/api/detail-user/'+project+'/'+user);
      if (index > -1 ) {
        this.userDetailControl.splice(index,1)
      } else {
        this.userDetailControl.push(user)
      }
      this.userDetails = userDetail.data
    }
    
    async detailProject(id: number){
      const query = await axios.get('/api/detail-project/'+id);
      const index = this.opened.indexOf(id);
      if (index > -1) {
        this.opened.splice(index,1)
      }else{
        this.opened.push(id)
      }
      this.details = query.data;
    }

    async projectTime(){
        const  query = await axios.get('/api/projecttimeworkuser');
        this.ProjectsTime = query.data;
    }
    async recordsbyProject(){
      const query = await axios.get('/api/records-project');

      this.projectsReport = query.data;
    }
   
    async projectReport(){
      const queryReport = await axios.get(this.API_Domain+'/api/projecttimeworkuser/export-report');
      this.exportExcel(queryReport.data);
    }

    exportExcel(infoExport: any){
      const data = XLSX.utils.json_to_sheet(infoExport)
      const workbook = XLSX.utils.book_new()
      const filename = 'Timworks-Reporte-Proeycto'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    }
}
</script>

<style>

</style>