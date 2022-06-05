<template>
  <div>
    <div class="row p-2">
      <div class="col-md-4">
        <div class="row d-flex align-items-center">
          <div>
            Colaborador(a):
          </div>
          <div class="ml-1">
            <a-select @change="onUserChanged" default-value="Selecciona una opcion" style="width: 100%">
              <a-select-option  v-for="(user, index) in users" :key='index'>
                {{ user.name }}
              </a-select-option>
              template
            </a-select>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="row d-flex align-items-center">
          <div>
            Mes:
          </div>
          <div class="ml-1">
            <month-picker-input @change="onDateChanged" :input-pre-filled="true" :default-month="month" :default-year="year" lang="es"></month-picker-input>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <div class="row d-flex align-items-center">
          <div>
            Actividad(es):
          </div>
          <div class="ml-1">
            <v-select @input="onProjectsSelectedChanged" v-model="projectsSelected" taggable multiple label="project" :options="projects" placeholder="Selecciona una o mas actividades"/>
          </div>
        </div>
      </div>
    </div>
    <div class="row p-4 text-left" v-if="response">
      <div class="col-md-12">
        <strong>RESUMEN GENERAL DEL {{ monthName }}</strong>
        <p>
          <b style="color: black"> Total horas: {{ response.totalHours }} hrs.</b>
        </p>
      </div>
      <div class="col-md-12">
        <highcharts v-if="horizontalChart!=null" :options="horizontalChart"></highcharts>
      </div>
      <div class="col-md-12">
        <div class="row">
          <div class="col-3">
            <div class="d-flex align-items-center justify-content-center">
              <div><span class="dot dot-pro"></span></div> <div>Proyectos</div>
            </div>

          </div>
          <div class="col-3">
            <div class="d-flex align-items-center justify-content-center">
              <div><span class="dot dot-ad"></span></div> <div>Administración de proyectos</div>
            </div>
          </div>
          <div class="col-3">
            <div class="d-flex align-items-center justify-content-center">
              <div><span class="dot dot-over"></span></div> <div>Overhead</div>
            </div>
          </div>
          <div class="col-3">
            <div class="d-flex align-items-center">
              <div><span class="dot dot-off"></span></div> <div>No Laborado</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row p-4 text-left" v-if="charts.length">
      <div class="col-md-12">
        <strong>
          DESGLOSE POR ORGANIZACIÓN
        </strong>
      </div>
      <div class="col-md-6" v-for="(option, index) in charts" :key="index">
        <div class="row text-center justify-content-center">
          <highcharts :options="option"></highcharts>
        </div>
        <div class="row">
          <div class="col-12"><strong>{{ option.myOwnTitle}}</strong></div>
          <div class="col-12">Total de horas: {{ option.totalHoras }} hrs.</div>
          <div class="col-12">Porcentaje: {{ option.porcentaje }}%</div>
        </div>
      </div>
    </div>

    <div class="row p-4 justify-content-center" v-if="charts.length">
      <button @click="exportToExcel" type="button" class="ml-2 btn btn-outline-success btn-custom-green btn-sm actions-button">
        Descargar Excel <img class="ml-1" style="width: 18px" src="/assets/images/excel.png">
      </button>
      <button @click="exportToPDF" :disabled="loadingExportPdf" type="button" class="ml-2 btn btn-outline-success btn-custom-red btn-sm actions-button">
        Descargar PDF <img class="ml-1" style="width: 18px" src="/assets/images/pdf.png">
      </button>
      <button  type="button" class="ml-2 btn btn-outline-success btn-custom-purple btn-sm actions-button">
        Descargar Reporte Final <img class="ml-1" style="width: 18px" src="/assets/images/final.png">
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {RotateSquare2} from "vue-loading-spinner";
import moment from "moment";
import axios from "axios";
import {MonthPickerInput} from "vue-month-picker";
import vSelect from "vue-select";
import {Chart} from 'highcharts-vue'
import XLSX from "xlsx";
import {Modal} from "ant-design-vue";

@Component({
  components:{
    RotateSquare2, MonthPickerInput, vSelect, Chart
  }
})

export default class UsersRegisters extends Vue {
  users: any = [];
  projects: any = [];
  projectsSelected: any = [];
  userSelected: any = null;
  response: any = null;
  monthName = '';
  chartOptions: any = null;
  horizontalChart: any = null;
  totalHours = 0;
  options: any = [];
  charts: any = [];
  loadingExportPdf = false;

  month = moment().month();
  year =  moment().year();

  async created(){
    const response = await axios.post('/api/user-list');
    this.users = response.data
  }

  async exportToPDF() {
    const params = {
      "month": this.month,
      "year": this.year,
      "userId": this.userSelected.id
    }
    this.loadingExportPdf = true;
    try {
      const response = await axios.post('/api/user-registers-report', params);
      this.loadingExportPdf = false;
      if (response.data.success) {
        window.open(response.data.path, '_blank');
      } else {
        const success = Modal.error;
        success({
          title: "No se ha podido generar el pdf correctamente",
          content: '',
          okText: 'Aceptar',
        });
      }
    } catch (e) {
      this.loadingExportPdf = false;
      const success = Modal.error;
      success({
        title: "No se ha podido generar el pdf correctamente",
        content: '',
        okText: 'Aceptar',
      });
    }
  }

  exportToExcel(){
    const headers = ['code', 'detail', 'date_time', 'hours'];
    const array = this.response.data.map( (i: any) =>  {
      return {
        'code'   : i.project,
        'detail' : i.detail,
        'date_time' : i.date_time,
        'hours'   : i.hours
      }
    });
    const data = XLSX.utils.json_to_sheet(array, {
      header: headers
    })
    data['A1'].v = 'Código'
    data['B1'].v = 'Detalle'
    data['C1'].v = 'Fecha Ejecución'
    data['D1'].v = 'Tiempo(Hrs)'
    const userName = this.userSelected.name.replace(/ /g, "_");

    const workbook = XLSX.utils.book_new()
    const filename = `Registros_de_${userName}_del_mes_de_${this.monthName}_del_${this.year}`;
    XLSX.utils.book_append_sheet(workbook, data, "registros")
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  async onUserChanged(index: any){
    this.userSelected =  (typeof index === 'number') ? this.users[index] : null;
    const response = await axios.post('/api/project-list/'+this.userSelected.id);
    this.projects = response.data;
    await this.buildCharts();
  }

  onDateChanged(date: any){
    this.year = date.year;
    this.month = date.monthIndex - 1;
    this.buildCharts();
  }

  onProjectsSelectedChanged(){
    this.buildCharts();
  }

  async buildCharts() {
    if (this.userSelected == null) return;

    this.response = null;
    this.options = [];
    this.charts = [];

    const data = {
      'user_id': this.userSelected.id,
      'year': this.year,
      'month': this.month + 1,
      'projects': this.projectsSelected.map((item: any) => item.project)
    };

    try {
      const response = await axios.post('/api/get/data/revision-detail', data);
      this.response = response.data;
      this.buildHorizontalChart();
      this.buildPieCharts();
    } catch (e) {
      console.log(e);
    }
  }

  buildHorizontalChart(){
    if (this.response == null) return;

    const nowData = this.response.nowData.map(function (item: any) {
      return {
        name: item.name,
        y: item.percentage,
        p: item.percentage.toFixed(2)
      };
    }).filter(function (item: any) {
      return item.y > 0;
    });

    const colors = this.response.nowData.filter( (i: any) => i.hours > 0 ).map( (i: any) => i.color );

    const subtitle = "Del "+this.response.year;

    this.monthName = this.response.monthName;

    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Distribución tiempos, por tipo de actividad'
      },
      subtitle: {
        text: subtitle
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.p}%</b>'
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
            format: '<b>{point.name}</b>: {point.p} %'
          }
        }
      },
      series: [{
        name: '',
        colorByPoint: true,
        data: nowData
      }],
      colors : colors
    }

    const horizontalChartData: any = [];

    const horizontalChartColors: any = [];

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;

    this.response.nowData.forEach(function (item: any) {
      item.codes.forEach((code: any) => {
        horizontalChartData.push({
          name: code.code,
          y: code.hours,
          p: parseFloat((Math.round(Number(code.hours) * 100) / Number(me.response.totalHours)).toString()).toFixed(2) //this.calcularPorcentaje(Number(code.hours), Number(response.data.totalHours))
        });

        horizontalChartColors.push(item.color);
      });
    });

    this.horizontalChart = {
      chart: {
        type: 'bar'
      },
      title: {
        text: "Horas y porcentaje de horas por subactividad"
      },
      subtitle: {
        text: subtitle
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: ''
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: true,
            format: '{point.y} ({point.p}%)'
          },
          cursor: 'pointer',
          point: {
            events: {
              click: function (e: any) {
                console.log(e)
                //me.openModalFromCode(e.point.name);
              }
            }
          }
        },
      },
      series: [
        {
          name: "SubActividades",
          colorByPoint: true,
          data: horizontalChartData
        }
      ],
      colors: horizontalChartColors
    };
  }

  buildPieCharts(){
    const subtitle = "DEL MES DE "+this.response.monthName;

    this.response.dataByOrg.forEach((org: any, index: any) => {
      const data = org.data.map(function (item: any) {
        return {
          name: item.reference,
          y: item.percentage,
          p: item.percentage,
          hours: item.hours,
        }
      });

      if(data.length){
        let sum = 0;
        data.forEach(function(item: any) {
          sum = sum + item.hours;
        })

        const title = org.name;
        const hours = sum;
        this.creatPieChart(title, subtitle, data, org.colors, hours);
      }
    });

    let sum = 0;
    this.options.forEach(function(item: any) {
      sum = sum + item.totalHoras;
    })

    this.totalHours = sum;

    this.charts = this.options.map(function (item: any){
      item.porcentaje = Math.round((item.totalHoras * 100) / sum);
      return item;
    });
  }

  creatPieChart(title: string, subtitle: any, data: any, colors: [], horas: any) {
// eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;

    const option = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        marginTop: 0,
        height: 300,
        width: 300,
      },
      exporting: {
        enabled: false
      },
      myOwnTitle: title,
      title: {
        text: '',
        style: {
          display: 'none'
        }
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
            format: '<b>{point.name}</b>: {point.p} %'
          }
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (e: any) {
                console.log(e);
                //me.openModalFromCode(e.point.name);
              }
            }
          }
        }
      },
      series: [{
        name: '',
        colorByPoint: true,
        data: data
      }],
      colors : colors,
      totalHoras: horas
    };

    this.options.push(option);
  }



}
</script>

<style >
 .month-picker-input{
  padding: 0.6em 0.6em !important;
}

 .v-select{
   min-width: 300px !important;
 }

 .month-picker-input-container{
   z-index: 100000 !important;
 }

 .dot {
   height: 20px;
   width: 20px;
   border-radius: 50%;
   display: inline-block;
   margin-right: 5px;
 }
 .dot-ad{
   background-color: #006462;
 }
 .dot-pro{
   background-color: #8EBE29;
 }

 .dot-over {
   background-color: #B23451;
 }

 .dot-off{
   background-color: #212021;
 }

 .btn-custom-red{
   border-color: #D61D26;
   color: #D61D26;
 }

 .btn-custom-red:hover{
   color: #FFF;
   background-color: #ffa5a8;
   border-color: #D61D26;
 }

 .btn-custom-purple{
   color: #6F78D2;
   border: 2px solid #6F78D2;
 }

 .btn-custom-purple:hover{
   color: #fff;
   background-color: #bcc3ff;
   border: 2px solid #6F78D2;
 }
</style>
