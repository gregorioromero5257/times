<template>
  <div>
    <div class="row">
      <div class="col-md-7">
        <h6 class="text-muted">Registros generales</h6>
      </div>
      <div class="col-md-5 text-right" style="border-bottom: 1px solid #F5B133">
        <a-range-picker  @change="dateRangeSelected" />
      </div>
    </div>

    <div class="row">
      <rotate-square2 v-if="isLoading"></rotate-square2>
    </div>

    <highcharts v-show="data.length" id="myChart"  :options="chartOptions" ref="chart"></highcharts>
    <div class="row mt-2 p-3" v-if="data.length">
      <div class="row p-3">
        <button class="btn btn-success" @click="exportToExcel">Exportar</button>
      </div>
      <table class="table table-bordered table-responsive">
        <tr>
          <th>#</th>
          <th>Colaborador</th>
          <th>Cargo</th>
          <th>Código del proyecto</th>
          <th>Descripción</th>
          <th class="text-center">Tiempo destinado <br>(horas)</th>
        </tr>
        <tr v-for="(item, index) in data" :key='index'>
          <td>{{ index + 1}}</td>
          <td>{{ item.colaborador }}</td>
          <td>{{ item.cargo }}</td>
          <td>{{ item.codigo_proyecto }}</td>
          <td>{{ item.descripcion }}</td>
          <td>{{ item.tiempo_estimado }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import moment from "moment";
import axios from "axios";
import XLSX from 'xlsx';
import {RotateSquare2} from "vue-loading-spinner";

@Component({
  components:{
    RotateSquare2
  }
})
export default class GeneralRegisters extends Vue{

  data: any = [];
  startDate = '';
  endDate = '';
  isLoading = false;
  series: Array<any> = [];
  projects: Array<any> = [];

  get chartOptions() {
    return {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Horas reportadas en el período, por colaborador y actividad'
      },
      xAxis: {
        categories: this.projects
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal'
        }
      },
      series: this.series
    };
  }

  dateRangeSelected(date: any){
    if (!date.length) return;
    this.startDate = moment(date[0]._d).format('YYYY-MM-DD');
    this.endDate = moment(date[1]._d).format('YYYY-MM-DD');
    this.getRegistersByDateRange(this.startDate, this.endDate);
  }

  async getRegistersByDateRange(start: string, end: string){
    try{
      this.data = [];
      this.isLoading = true;
      const result = await axios.post('/api/general-registers-list', { start : start, end : end });
      this.data = result.data.result;

      const resultCharts = await axios.post('/api/general-registers-chart', { start : start, end : end });
      this.projects = resultCharts.data.projects;
      this.series = resultCharts.data.series;

      this.isLoading = false;
    }catch (e) {
      console.log(e);
      this.isLoading = false;
    }
  }


  exportToExcel(){
    const headers = ['colaborador', 'cargo', 'codigo_proyecto', 'descripcion', 'tiempo_estimado'];
    const data = XLSX.utils.json_to_sheet( this.data, {
      header: headers
    })
    data['A1'].v = 'Colaborador'
    data['B1'].v = 'Cargo'
    data['C1'].v = 'Código del Proyecto'
    data['D1'].v = 'Descripción'
    data['E1'].v = 'Tiempo Estimado (hrs)'

    const workbook = XLSX.utils.book_new()
    const workbookNname = "registros";
    XLSX.utils.book_append_sheet(workbook, data, workbookNname);
    const fileName = `registros_generales_del_${this.startDate}_al_${this.endDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

}
</script>

<style scoped>
  #myChart{
    height: 800px !important;
  }
</style>
