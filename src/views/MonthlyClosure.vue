<template>
  <div class="container-fluid">
    <p class="paragraphs">
      Las siguientes gráficas desglosan los registros importados por categoría y código de proyecto. Si no hay errores o ajustes, validar la consistencia de los registros y enviar reporte.
    </p>
    <hr>
    <div class="row">
      <div class="col-md-12">
        <strong>RESUMEN GENERAL DE {{ monthName.toUpperCase() }}
          <button v-show="!showBarHorizontalChart" class="btn btn-sm" @click="showBarHorizontalChart = true" style="background-color: transparent !important;"><i class="fa fa-angle-down"></i></button>
          <button v-show="showBarHorizontalChart" class="btn btn-sm" @click="showBarHorizontalChart = false" style="background-color: transparent !important;"><i class="fa fa-angle-up"></i></button>
        </strong>
        <p>
         <b style="color: black"> Total horas: {{ totalHours }} hrs.</b>
        </p>
      </div>
      <div class="col-md-12" v-show="showBarHorizontalChart">
        <highcharts v-if="chartHorizontal!=null" :options="chartHorizontal"></highcharts>
      </div>
      <div class="col-12 p-1" v-show="showBarHorizontalChart" style="background-color: #F1EFEF">
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
    <hr>
    <div class="row mt-3">
      <div class="col-md-12">
        <strong>
          DESGLOSE POR ORGANIZACIÓN
          <button v-show="!showCharts" class="btn btn-sm" @click="showCharts = true" style="background-color: transparent !important;"><i class="fa fa-angle-down"></i></button>
          <button v-show="showCharts" class="btn btn-sm" @click="showCharts = false" style="background-color: transparent !important;"><i class="fa fa-angle-up"></i></button>
        </strong>
      </div>
      <div v-show="showCharts" class="col-md-6" v-for="(option, index) in charts" :key="index">
        <div class="row">
          <div class="col-12"><strong>{{ option.myOwnTitle}}</strong></div>
          <div class="col-12">Total de horas: {{ option.totalHoras }} hrs.</div>
          <div class="col-12">Porcentaje: {{ option.porcentaje }}%</div>
        </div>
        <div class="row text-center justify-content-center">
          <highcharts :options="option"></highcharts>
        </div>
      </div>
    </div>
    <modal name="data" :scrollable="true" :height="400" :adaptive="true" :width="800">
      <div class="row p-4">
        <div class="col-md-12">
         <b> Registros #{{ code }}</b>
          <button class="btn btn-sm btn-success ml-3 mb-2" v-show="dataTemporary.length" @click="dataExport">
            Exportar
          </button>
        </div>
        <div class="col-md-12" >
          <div class="tableFixHead">
            <table class="table table-bordered">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Detalle</th>
                <th scope="col">Fecha de ejecución</th>
                <th scope="col">Tiempo</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in dataTemporary" :key="index">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ item.detail }}</td>
                <td>{{ item.date_time }} </td>
                <td>{{ item.hours }} hrs.</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {RotateSquare2} from 'vue-loading-spinner';
import axios from "axios";
import {Chart} from 'highcharts-vue'
import {collect} from "collect.js";
import XLSX from "xlsx";
@Component({
  components:{
    RotateSquare2,
    highcharts: Chart
  }
})
export default class UsePolicy extends Vue {
  data = [];
  isLoading = false;
  chartOptions: any = null;
  chartHorizontal: any = null;
  charts: any = [];
  options: any = [];
  showCharts = true;
  showBarHorizontalChart = true;
  monthName = "";
  code = "";
  dataTemporary = [];
  totalHours = 0;

  async created(){

    try {
      //array de registros importados
      this.data = this.$store.state.data;

      console.log(this.data);

      const response = await axios.post('/api/store/temporarily', {data: this.data});


      const nowData = response.data.nowData.map(function (item: any) {
        return {
          name: item.name,
          y: item.percentage,
          p: item.percentage.toFixed(2)
        };
      }).filter(function (item: any) {
        return item.y > 0;
      });

      const colors: any = [];

      response.data.nowData.forEach(function (item: any) {
        if(item.hours > 0){
          colors.push(item.color);
        }
      });

      const subtitle = response.data.monthName+" "+response.data.year;

      this.monthName = response.data.monthName;

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

      const leftChartData: any = [];

      const leftChartColors: any = [];

      response.data.nowData.forEach(function (item: any) {
        item.codes.forEach(function (code: any) {
          leftChartData.push({
            name: code.code,
            y: code.hours,
            p: parseFloat((Math.round(Number(code.hours) * 100) / Number(response.data.totalHours)).toString()).toFixed(2) //this.calcularPorcentaje(Number(code.hours), Number(response.data.totalHours))
          });

          leftChartColors.push(item.color);
        });
      });

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const me = this;

      this.chartHorizontal = {
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
                  me.openModalFromCode(e.point.name);
                }
              }
            }
          },
        },
        series: [
          {
            name: "SubActividades",
            colorByPoint: true,
            data: leftChartData
          }
        ],
        colors: leftChartColors
      };

      this.crearGraficasPorEmpresa(response.data, subtitle);

    }catch (e) {
      console.log(e.message)
    }
  }

  async openModalFromCode(code: string){
    this.code = code;
    this.dataTemporary = [];
    const response = await axios.post('/api/get/data/temporarily', { code: code });
    this.dataTemporary = response.data;
    this.$modal.show('data');
  }

  crearGraficasPorEmpresa(data: any, subtitle: any){
    data.dataByOrg.forEach((org: any, index: any) => {
      const data = org.data.map(function (item: any) {
        return {
          name: item.reference,
          y: item.percentage,
          p: item.percentage.toFixed(2),
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
      console.log(item.totalHoras+" * "+" / "+sum);
      const result = Math.round((item.totalHoras * 100) / sum)
      item.porcentaje = result;
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
                me.openModalFromCode(e.point.name);
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

  dataExport(){
    const headers = ['detail', 'date_time', 'hours'];
    const array = this.dataTemporary.map( (i: any) =>  {
      return {
        'detail' : i.detail,
        'date_time' : i.date_time,
        'hours'   : i.hours
      }
    });

    const data = XLSX.utils.json_to_sheet(array, {
      header: headers
    })
    data['A1'].v = 'Detalle'
    data['B1'].v = 'Fecha Ejecución'
    data['C1'].v = 'Tiempo(Hrs)'
    const userName = this['$store'].state.user.name.replace(/ /g, "_");

    const workbook = XLSX.utils.book_new()
    const filename = `Registros(${this.code})_de_${this.monthName}`;
    XLSX.utils.book_append_sheet(workbook, data, "tiempo")
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
}
</script>
<style scoped>
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

  .tableFixHead          { overflow: auto; height: 350px; }
  .tableFixHead thead th { position: sticky; top: 0; z-index: 1; }

  /* Just common table stuff. Really. */
  table  { border-collapse: collapse; width: 100%; }
  th, td { padding: 8px 16px; }
  th     { background:#eee; }
</style>
