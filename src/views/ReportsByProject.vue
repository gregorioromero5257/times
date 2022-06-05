<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-1 col-md-1"></div>
      <div class="col-lg-5 col-md-5">
        <div class="d-flex justify-content-center">
          <label for="inputState" style="font-weight: bold;">Filtro por proyecto</label>
        </div>
        <div class="d-flex justify-content-center">
          <a-select  default-value="Selecciona un proyecto" style="width: 398px" @change="handleChange" placeholder="Selecciona un proyecto">
            <a-select-option  value="">
              Todos los proyectos
            </a-select-option>
            <a-select-option  v-for="(project) in projects" :key='project.id'>
              {{project.name}}
            </a-select-option>
            template
          </a-select>
        </div>
      </div>
      <div class="col-lg-5 col-md-5">
        <div class="d-flex justify-content-center">
          <label for="inputState" style="font-weight: bold;">Filtro por fecha</label>
        </div>
        <div class="d-flex justify-content-center">
          <a-range-picker  @change="dateRange" />
        </div>
      </div>
      <div class="col-lg-1 col-md-1"></div>
    </div>
    <br>
    <div class="row">
      <div class="col-lg-1 col-md-1"></div>
      <div
        class="col-lg-10 col-md-10"
        style="
          background: #fffffe;
          box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.25);
          border-radius: 8px;
        "
      >
        <br />
        <br />
        <div class="row">
          <div class="col-lg-6 col-md-6">
            <br />
            <br />
            <table class="table">
              <thead style="background: #f4f7f9" >
                <th style="font-weight: bold;">Proyecto</th>
                <th style="font-weight: bold;">Tiempo</th>
              </thead>
              <tbody>
                <tr v-for="(query, index) in structureGraph" :key='index'>
                  <td><div class="row"><div class="col-lg-2 col-md-2"><!-- <div class="cuadrado"></div> --></div><div class="col-lg-8 col-md-8">{{query[0]}}</div> </div></td>
                  <td>{{query[1]}} horas</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="col-lg-6 col-md-6">
            <div class="d-flex justify-content-between">
              <highcharts :options="chartOptions" ref="chart"></highcharts>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-1 col-md-1"></div>
    </div>
    <br>
    <br>
    <br>
    <div class="row">
      <div class="col-lg-1 col-md-1"></div>
      <div class="col-lg-10 col-md-10">
        <table class="table">
          <thead style="background: #f4f7f9">
            <th style="font-weight: bold;">Colaborador</th>
            <th style="font-weight: bold;">Cargo</th>
            <th style="font-weight: bold;">Codigo y nombre del proyecto</th>
            <th style="font-weight: bold;">Descripción</th>
            <th style="font-weight: bold;">Tiempo destinado</th>
          </thead>
          <tbody>
            <tr v-for="(query, index) in projectsReport" :key='index'>
              <td>{{query.user.name}}</td>
              <td>{{query.user.position.name}}</td>
              <td>{{query.project.name}}</td>
              <td>{{query.description}}</td>
              <td>{{query.hours}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-lg-1 col-md-1"></div>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';
import moment from "moment";
@Component
export default class GeneralReports extends Vue {
  projectsReport: Array<any>=[];
  orifinalProjectsReport: Array<any>=[];
  structureGraph: Array<any>=[];
  projects: Array<any>=[];
  originalGraph: Array<any>=[];
  projectSelected: any = null;
  dateSelected: any = null;
  created() {
    this.recordsbyProject();
    this.generalReports();
    this.initialInfo();
  }
  get chartOptions() {
    const options = {
      chart: {
        type: "pie",
        options3d: {
          enabled: false,
          alpha: 45,
        },
      },
      title: {
        text: "",
      },
      //colors: ['#562F1E', '#AF7F24', '#263249', '#5F7F90', '#D9CDB6'], 
      subtitle: {
        text: "",
      },
      plotOptions: {
        pie: {
          innerSize: 150,
          depth: 60,
        },
      },
      series: [
        {
          name: "Horas totales",
          data: 
          this.structureGraph,
        },
      ],
    };
    return options;
  }
  async initialInfo(){
    const  projects = await axios.get('/api/project-all');
    this.projects = projects.data;
  }
  
  async  dateRange(date: any) {
    
      this.dateSelected = date;
      const initial = moment(date[0]._d).toISOString();
      const final = moment(date[1]._d).toISOString();

      const infoFilter: any = {
         initial: initial,
         final: final,
         project: this.projectSelected
      }
     console.log(this.projectSelected);
     
      
      const graphStructure = [];
      const filter = await axios.post('/api/datefilter',infoFilter);
      const detailFilter = await axios.post('/api/detail-filter-project',infoFilter);
      
      for (let index = 0; index < Object.keys(filter.data).length; index++) {
        const element: any = Object.values(filter.data)[index];
        graphStructure.push([element.ProjectTimeworkUser[0].project.name,element.hours_total])
      }
      this.projectsReport = detailFilter.data;
      this.structureGraph = graphStructure;
      this.originalGraph  = graphStructure;

    }
     async handleChange(value: any) {
       this.projectSelected = value;
       console.log('entra a este');
       console.log(this.dateSelected);
       if (this.dateSelected) {
         const initial = moment(this.dateSelected[0]._d).toISOString();
          const final = moment(this.dateSelected[1]._d).toISOString();
          const infoFilter: any = {
          initial: initial,
          final: final,
          project: this.projectSelected
        }
        const filter = await axios.post('/api/datefilter',infoFilter);
        const detailFilter = await axios.post('/api/detail-filter-project',infoFilter);
        const graphStructure = [];
        for (let index = 0; index < Object.keys(filter.data).length; index++) {
          const element: any = Object.values(filter.data)[index];
          graphStructure.push([element.ProjectTimeworkUser[0].project.name,element.hours_total])
        }
       this.projectsReport = detailFilter.data;
        this.structureGraph = graphStructure;
        this.originalGraph  = graphStructure;
         console.log(filter);
       } else {
        
          const infoFilter: any = {
          initial: null,
          final: null,
          project: this.projectSelected
        }
        const filter = await axios.post('/api/datefilter',infoFilter);
        const detailFilter = await axios.post('/api/detail-filter-project',infoFilter);
        const graphStructure = [];
        for (let index = 0; index < Object.keys(filter.data).length; index++) {
          const element: any = Object.values(filter.data)[index];
          graphStructure.push([element.ProjectTimeworkUser[0].project.name,element.hours_total])
        }
       this.projectsReport = detailFilter.data;
        this.structureGraph = graphStructure;
        this.originalGraph  = graphStructure;
         console.log(filter);
       }
          
        
        
        
    }
    async recordsbyProject(){
      const graphStructure = [];
      const query = await axios.get('/api/records-project');
     /*  for (let index = 0; index < Object.keys(query.data).length; index++) {
        const element: any = Object.values(query.data)[index];
        console.log('initial info')
        console.log(element)
        graphStructure.push([element.ProjectTimeworkUser[0].user.name,element.hours_total])
      } */
      for (let index = 0; index < Object.keys(query.data).length; index++) {
        const element: any = Object.values(query.data)[index];
        graphStructure.push([element.ProjectTimeworkUser[0].project.name,element.hours_total])
      }
      
      this.structureGraph = graphStructure;
      this.originalGraph  = graphStructure;
    }
    async generalReports(){
      const  query = await axios.get('/api/projecttimeworkuser');
      this.projectsReport = query.data;
      this.orifinalProjectsReport = query.data;
    }
}
</script>
<style >
.cuadrado {
  width:3vh;
  max-width:27px;
  height:3vh;
  max-height:27px;
  position:relative;
  background:red;
}
</style>