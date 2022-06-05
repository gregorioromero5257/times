<template>
  <div>
    <div class="row">
      <div class="col-md-7">
        <h6 class="text-muted">Registros por actividad </h6>
        <div class="row">
          <div class="col-md-6">
            <a-select  default-value="Selecciona un proyecto" style="width: 100%" @change="selectChange"  placeholder="Selecciona una actividad">
              <a-select-option  value="">
                Todas las actividades
              </a-select-option>
              <a-select-option  v-for="(project, index) in projects" :key='index'>
                {{ project.project }}
              </a-select-option>
              template
            </a-select>
          </div>
        </div>
      </div>
      <div class="col-md-5 text-right" style="border-bottom: 1px solid #F5B133">
        <a-range-picker  @change="dateRangeSelected" />
      </div>
    </div>
    <div class="row">
      <rotate-square2 v-if="isLoading"></rotate-square2>
    </div>
     <highcharts v-show="data.length"  id="myChart"  :options="chartOptions" ref="chart"></highcharts>
    <div class="row mt-2 p-3" v-if="data.length">
      <div class="row p-3">
        <button class="btn btn-success" @click="exportToExcel">Exportar</button>
      </div>
      <table class="table table-bordered table-responsive">
        <tr>
          <th>#</th>
          <th>Colaborador</th>
          <th>Código de la actividad</th>
          <th class="text-center">Tiempo (horas)</th>
        </tr>
        <tr v-for="(item, index) in data" :key='index'>
          <td>{{ index + 1}}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.project }}</td>
          <td>{{ item.hours }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import { RotateSquare2 } from "vue-loading-spinner";
import axios from "axios";
import moment from "moment";
import XLSX from "xlsx";

@Component({
  components:{
    RotateSquare2
  }
})
export default class ProjectRegisters extends Vue{
  private isLoading = false;
  private series: Array<any> = [];
  private data: any = [];
  private projects: any = [];
  private project: any = null;
  private startDate: any = null;
  private endDate: any = null;

  async created(){
    const response = await axios.post('/api/project-list-full');
    console.log(response);
    this.projects = response.data;
  }

  public selectChange(value: any){
    this.project =  (typeof value === 'number') ? this.projects[value] : null;
    this.getRegistersByProject(this.startDate, this.endDate);
  }

  private dateRangeSelected(date: any){
    if (!date.length) return;
    this.startDate = moment(date[0]._d).format('YYYY-MM-DD');
    this.endDate = moment(date[1]._d).format('YYYY-MM-DD');
    this.getRegistersByProject(this.startDate, this.endDate);
  }

  private async getRegistersByProject(start: string, end: string){
    if (this.project == null) return;
    if (start == null && end ==null) return;

    try{
      this.data = [];
      this.isLoading = true;
      const result = await axios.post('/api/project-registers-list', {start: start, end: end, "project": this.project.project});
      this.data = result.data;
      const series: any[] = [];

      this.data.forEach( (item: any) => {
        series.push({
          name: item.name,
          y : Number(item.hours)
        })
      });

      console.log(series);

      this.series = series;

      this.isLoading = false;
    }catch (e) {
      console.log(e)
      this.isLoading = false;
    }
  }

  get chartOptions() {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Distribución del tiempo reportado, por colaborador'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Horas',
        colorByPoint: true,
        data: this.series
      }]
    };
  }


  private  exportToExcel(){
    const headers = ['name', 'project', 'hours'];
    const data = XLSX.utils.json_to_sheet( this.data, {
      header: headers
    })
    data['A1'].v = 'Colaborador'
    data['B1'].v = 'Código del Proyecto'
    data['C1'].v = 'Tiempo Estimado (hrs)'

    const workbook = XLSX.utils.book_new()
    const workbookNname = "registros";
    XLSX.utils.book_append_sheet(workbook, data, workbookNname);
    const fileName = `registros_por_proyecto_del_${this.startDate}_al_${this.endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
}
</script>

<style scoped>
#myChart{
  height: 600px !important;
}
</style>
