<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card">
          <h1 class="title-home">Consulta de registros previos</h1>
          <div class="row">
            <div class="col-6">
              <button @click="goToQueryTable" class="btn btn-block btn-light">Tabla</button>
            </div>
            <div class="col-6">
              <button class="btn btn-block btn-warning" >Gráfica</button>
            </div>
          </div>
          <div class="card-body card-shadow mt-4" >
            <div class="row pa-4 mb-4">
              <div class="col-md-6 mt-2">
                <a-select  default-value="" style="width: 100%" @change="projectChange" placeholder="Selecciona una actividad">
                  <a-select-option  value="">
                    Todas las actividades
                  </a-select-option>
                  <a-select-option  v-for="(project, index) in projects" :key='index'>
                    {{ project.project }}
                  </a-select-option>
                  template
                </a-select>
              </div>
              <div class="col-md-6 mt-2 justify-content-center text-center" >
                <a-range-picker  @change="dateRange" />
              </div>
            </div>
            <highcharts v-show="categories.length"  :options="chartOptions" ref="chart"></highcharts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import moment from "moment";

@Component
export default class QueryUserChart extends Vue {
  projects: Array<any>=[];
  projectSelected: any = null;
  isLoading = false;
  startDate: any = null;
  endDate: any = null;
  categories: any = [];
  series: any = [];

  goToQueryTable(){
    this['$router'].replace("/query-user");
  }

  created(){
    this.getUniquesProjects();
  }

  get chartOptions() {
    const options = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Horas registradas por actividad'
      },
      xAxis: {
        categories: this.categories
      },
      yAxis: {
        min: 0,
        title: { text: '' }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      colors: ['#5bd2a6'],
      minHeight: 500,
      series: this.series
    };
    return options;
  }

  async getUniquesProjects(){
    const response = await axios.post('/api/project-list');
    this.projects = response.data;
  }

  dateRange(date: any){
    if (date.length <= 0) return true;
    this.startDate  = moment(date[0]._d).format('YYYY-MM-DD'); //this.getInitialDay();
    this.endDate = moment(date[1]._d).format('YYYY-MM-DD');
    this.getData();
  }

  projectChange(index: any){
    this.projectSelected =  (typeof index === 'number') ? this.projects[index].project : null;
    this.getData();
  }

  async getData() {
    if (this.startDate == null && this.endDate == null) return true;

    this.isLoading = true;
    const result = await axios.post('/api/projects-registers-user-chart',{
      start: this.startDate,
      end: this.endDate,
      project: this.projectSelected
    });

    this.isLoading = false;

    this.categories = result.data.categories;

    this.series = [{
      name: result.data.name,
      data: result.data.series.map( (value: any) => parseFloat(value))
    }];

    console.log(this.categories);

    console.log(this.series);

  }
}
</script>

<style scoped>

</style>
