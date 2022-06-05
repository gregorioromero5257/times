<template>
  <div class="container-home">
    <!-- <div class="col-12"> -->
      <div class="card">
        <h1 class="title-home">Envío de informe</h1>

        <div class="card-body card-shadow mt-2">
          <div class="row pl-4 pr-4">
            <div class="col-md-4 p-0 m-0">
              <div :class="getClase(1)">
                <p class="pl-4 font-size-title">
                  <i v-if="steps > 1" class="fa fa-check" aria-hidden="true"></i>
                  {{ steps > 1 ? "" : "1. "}}
                  Importación de calendarios
                </p>
              </div>
            </div>
            <div class="col-md-4  m-0">
              <div :class="getClase(2)">
                <p class="pl-4 font-size-title">
                  <i v-if="steps > 2" class="fa fa-check" aria-hidden="true"></i>
                  {{ steps > 2 ? "" : "2. "}}
                  Vista previa del reporte
                </p>
              </div>
            </div>
            <div class="col-md-4 p-0 m-0">
              <div :class="getClase(3)">
                <p class="pl-4 font-size-title">
                  <i v-if="steps > 3" class="fa fa-check" aria-hidden="true"></i>
                  {{ steps > 3 ? "" : "3. "}}
                  Cierre del informe mensual
                </p>
              </div>
            </div>
          </div>
          <div class="row mt-4">
            <div class="col-md-12">
              <div v-show="steps === 1" >
                <div class="row pl-4">
                  <p class="paragraphs">
                    Para generar un informe completo, selecciona las fechas de inicio y fin del mes requerido (sin distinguir fin de semana o feriados). Para generar un reporte parcial, selecciona el rango de fechas deseado. Finalmente, agrega el calendario o calendarios deseados y click en el botón “Continuar”
                  </p>
                  <div class="d-flex align-items-center">
                    <a-range-picker  @change="dateRangeChanged" />
                    <button v-if="!isLoading"  type="button" class="ml-2 btn btn-outline-success btn-custom-green btn-sm actions-button" @click="importCalendar">Añadir Calendario</button>
                  </div>
                  <br><br>
                </div>
                <div class="row pl-4 mt-2">
                  <rotate-square2 v-if="isLoading"></rotate-square2>

                </div>
                <div class="row mt-2 pt-4 pl-4" style="border: 1px solid #969696;border-radius: 5px;"
                v-for="(item, index) in dataGrouped" :key="index"
                 >

                  <div class="flex">
                    <h6> Calendario {{ index + 1 }} <strong>{{ item.email }}</strong></h6>
                     <a @click="removeCalendar(index)" class="text-danger ml-2">Eliminar calendario &nbsp; <i class="ti-close"></i></a>
                   </div>
                  <div class="col-md-12">

                    <div class="tableFixHead">
                      <table class="table">
                        <thead>
                        <th scope="col">#</th>
                        <th scope="col">Codigo de proyecto</th>
                        <th scope="col">Detalle</th>
                        <th scope="col">Fecha de ejecucion</th>
                        <th sope="col">Tiempo destinado</th>
                        </thead>
                        <tbody>
                        <tr  v-for="(project, i) in item.items" :key="i">
                          <td :class="{ 'text-red' : isRepeated(project) }">{{ i + 1}}</td>
                          <td :class="{ 'text-red' : isRepeated(project) }">{{project.project}}</td>
                          <td :class="{ 'text-red' : isRepeated(project) }">{{project.detail}}</td>
                          <td :class="{ 'text-red' : isRepeated(project) }">{{project.dateStart}} - {{project.dateEnd}}</td>
                          <td :class="{ 'text-red' : isRepeated(project) }">{{project.hours}} Horas</td>
                        </tr>
                        <tr>
                          <td colspan="5" style="text-align: right; padding-right: 20px">
                            <h6>Subtotal de horas: {{ item.total }} hrs.</h6>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="row mt-2" v-if="dataGrouped.length > 0">
                  <h5 style="text-align: right; width: 100%; padding: 20px">Total de horas: {{ totalHours }}</h5>
                </div>
                <div class="row mt-2" v-show="showButtonExport && dataGrouped.length > 0">
                  <button class="btn btn-success" @click="dataExport">
                    Exportar
                  </button>
                </div>
                <div class="row mt-2 mr-4 text-right justify-content-end">
                  <button class="btn btn-purple" v-if="dataGrouped.length" @click="continuar">Continuar <i class="fa fa-arrow-right"></i></button>
                </div>
              </div>

              <div
              v-if="steps === 2"
              >
              <monthly-report-user @continueToNext="continueToNext"></monthly-report-user>
                <div class="flex">
                    <button class="btn btn-purple" @click="regresar">
                      <i class="fa fa-arrow-left"></i> Regresar
                    </button>
                    <button class="btn btn-purple" v-show="continueToEnd" @click="continuar">
                      Continuar <i class="fa fa-arrow-right"></i>
                    </button>
                </div>
              </div>

              <div
              v-if="steps === 3"
              >
                <monthly-closure></monthly-closure>
                <div class="row mt-4 pl-4 pr-4">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1" v-model="checkForSending">
                    <label class="custom-control-label check-policy" for="customCheck1">
                      <strong style="font-size: 0.9em">Manifiesto que las actividades y tiempos registrados en mis calendarios e importados en esta aplicación son consistentes con lo realizado durante el período que se reporta</strong>
                    </label>
                  </div>
                </div>
                <div class="flex mt-3">
                    <button class="btn btn-purple" @click="regresar">
                      <i class="fa fa-arrow-left"></i> Regresar
                    </button>
                    <rotate-square2 v-if="isLoading"></rotate-square2>
                    <button v-else class="btn btn-purple" @click="storeRegisters">Enviar informe <i class="fa fa-paper-plane"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import SideBar from '../components/SideBar.vue';
import Proxy from "../helpers/proxy";
import moment from "moment-timezone";
import axios from "axios";
import {RotateSquare2} from 'vue-loading-spinner'
import collect from 'collect.js';
import {Modal} from "ant-design-vue";
import XLSX from "xlsx";
import MonthlyReportUser from "@/views/MonthlyReportUser.vue";
import MonthlyClosure from "@/views/MonthlyClosure.vue";

axios.defaults.url = Proxy.api.domain;
declare const gapi: any;
const eventBuss = new Vue({});
@Component({
  components:{
    MonthlyClosure,
    MonthlyReportUser,
    SideBar, RotateSquare2
  }
})
export default class Index extends Vue {
  @Prop() private msg!: string;

  // GOOGLE CALENDAR CREDENTIALS AND INFO
  CLIENT_ID = '991461654848-8a9ir5d2aps6ds54llr51efrf2cq8qrh.apps.googleusercontent.com';
  API_KEY = 'AIzaSyDB3A0IlmAGxdPUDCk8DhtfYbJq5qYwLxI';
  DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
  SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  checkForSending =  false;
  timeMin: any = null;
  timeMax: any = null;
  infoProjects:  Array<any> = [];
  infoRepeatedProjects:  Array<any> = [];
  isLoading = false;
  showButtonExport = false;
  totalHours: number | string = 0;
  timeMinString = '';
  timeMaxString = '';
  api: any = null;
  authorized = false;
  emailNow: any = null;
  dataGrouped: any = [];
  steps = 1;
  continueToEnd = true;


  dateRangeChanged(date: any){

    if (date.length > 0){
      const tz = moment.tz.guess();
      this.timeMin = moment(date[0]._d).tz(tz).startOf('day').toISOString();
      this.timeMax = moment(date[1]._d).tz(tz).endOf('day').toISOString();
      this.timeMinString = moment(date[0]._d).tz(tz).endOf('day').format('DD-MM-YYYY');
      this.timeMaxString = moment(date[1]._d).tz(tz).endOf('day').format('DD-MM-YYYY');

      const startOfMonth =  moment(date[0]._d).tz(tz).startOf('month').startOf('day').toISOString();
      const endOfMonth = moment(date[1]._d).tz(tz).endOf('month').endOf('day').toISOString();
      this.showButtonExport = !(this.timeMin == startOfMonth && endOfMonth == this.timeMax);
    }else{
      this.showButtonExport = false;
    }

    console.log(this.showButtonExport);
  }

  continuar(){
    this.steps = this.steps + 1;
  }


  getClase(step: any){
    if (this.steps == 1 && step == 1) return "arrow-square";
    if (this.steps > 1 && step == 1) return "arrow-green-square";
    if (this.steps == step) return "arrow";
    if (this.steps > step ) return "arrow-green"
    return "arrow-gray";
  }

  regresar(){
    this.steps = this.steps - 1;
  }


  async created() {
      this.api = gapi;
     await this.handleClientLoad();

  }

  handleClientLoad() {
    this.api.load("client:auth2", this.initClient);
  }

  continueToNext(val: boolean){
    this.continueToEnd = val;
  }

  async initClient() {
    await this.api.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    });
    this.api.auth2.getAuthInstance().isSignedIn.listen(this.statusSession);

    this.statusSession(this.api.auth2.getAuthInstance().isSignedIn.get());
  }

  statusSession(isSignedIn: any){
    this.authorized = isSignedIn;
  }

  async importCalendar(){
    if (this.authorized){
      await this.handleSignOutClick();
    }
    Promise.resolve(this.api.auth2.getAuthInstance().signIn()).then(res => {
      this.authorized = true;
      this.getData();
    });
  }



  async  getData() {
    this.isLoading = true;

    const response = await this.api.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: this.timeMin,
      timeMax: this.timeMax,
      showDeleted: false,
      singleEvents: true,
      orderBy : "startTime",
      maxResults: 20000,
    });
    console.log(response.result.items);
    this.emailNow = response.result.summary;
    this.processResult(response.result.items);
    this.isLoading = false;
    this.checkEventsRepeated(this.infoProjects);
  }

  handleSignOutClick(){
    Promise.resolve(this.api.auth2.getAuthInstance().signOut());
  }

  showAlert(title: string) {
    const confirm = Modal.info;
    confirm({
      title: title ,
      content: '',
      okText: 'Aceptar',
    });
  }

  async storeRegisters(){
    try{
      if (!this.checkForSending){
        this.showAlert('Antes de enviar, debes aceptar las condiciones');
        return;
      }
      const dates: any = this.$store.state.data;

      let result: any = await axios.post('/api/check-register-is-same-date', { data : dates });

      if (result.data.exists){
        const confirm = await this.$swal({
          title: 'Ya tienes registros en esta fecha. ¿Deseas remplazarlos?',
          showCancelButton: true,
          confirmButtonText: `Aceptar`,
          cancelButtonText: `Cancelar`
        })
        if (!confirm.isConfirmed){
          return true;
        }
      }

      this.isLoading = true;

      result = await axios.post('/api/events/store', { data : dates });

      const success = Modal.success;
      success({
        title: "Tu información se ha guardado correctamente" ,
        content: '',
        okText: 'Aceptar',
      });

      this.isLoading = false;
      this.steps = 1;

    }catch (e) {
      console.log(e);
      const success = Modal.error;
      this.isLoading = false;
      success({
        title: "La información no se ha podido guardar, intentelo más tarde" ,
        content: '',
        okText: 'Aceptar',
      });
    }
  }

  dataExport(){
    const headers = ['project', 'detail', 'dateStart', 'dateEnd', 'hours'];
    const data = XLSX.utils.json_to_sheet( this.infoProjects, {
      header: headers
    })
    data['A1'].v = 'Proyecto'
    data['B1'].v = 'Detalle'
    data['C1'].v = 'Inicio'
    data['D1'].v = 'Fin'
    data['E1'].v = 'Horas'

    const userName = this['$store'].state.user.name.replace(/ /g, "_");

    const workbook = XLSX.utils.book_new()
    const filename = `ReporteParcial_de_${userName}_del_${this.timeMinString}_al_${this.timeMaxString}`;
    XLSX.utils.book_append_sheet(workbook, data, "tiempo_parcial")
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }



  checkEventsRepeated(items: any){

    items.forEach( (event: any) => {
      const startDate = moment(event.dateStart);
      const endDate =  moment(event.dateEnd);
      const find = items.find( (item: any) => {
        const start= moment(item.dateStart);
        const end =  moment(item.dateEnd);
        return (startDate.isBetween(start, end) || endDate.isBetween(start, end));
      })
      if (find) this.infoRepeatedProjects.push(find);
    });

    if(this.infoRepeatedProjects.length){
      console.log(this.infoRepeatedProjects);
      const confirm = Modal.info;
      confirm({
        title: "Detectamos algunos eventos cruzados" ,
        content: 'Estos apareceran con texto rojo',
        okText: 'Aceptar',
      });
    }

  }

  isRepeated(item: any){
    let isRepeated = false;

    this.infoRepeatedProjects.forEach(function (info: any){
      if (info.dateStart == item.dateStart && info.dateEnd == item.dateEnd){
        isRepeated = true;
      }
    });

    return isRepeated;
  }

  removeCalendar(index: any){
    const email = this.dataGrouped[index].email;
    this.dataGrouped.splice(index, 1);

    this.infoProjects = this.infoProjects.filter( item => item.email != email);
    this.$store.commit('SET_DATA', this.infoProjects);

    this.calculateTotalHours();
  }

  processResult(results: any){
    if (results.length > 0 ){
      for (let i = 0; i < results.length; i++) {
        this.processEvent(results[i]);
      }
    }
    this.groupedItem();
    this.$store.commit('SET_DATA', this.infoProjects);
    this.calculateTotalHours();
  }

  calculateTotalHours(){
    const data = collect(this.infoProjects);
    this.totalHours = (this.infoProjects.length) ? data.sum('hours') : 0;
  }

  groupedItem(){
    const key = "email";

    const data = this.infoProjects.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});


    this.dataGrouped = Object.entries(data).map(function(item: any){
      return {
        email: item[0],
        items: item[1],
        total: collect(item[1]).sum("hours")
      };
    });
  }

  processEvent(event: any){
    try{
      const regex = /#\w+:.+/;
      if (regex.test(event.summary)){
        const previewObject = {
          hours: 0,  dateStart: "",  dateEnd: "", project: "", detail: "", email: ""
        };

        let next = false;

        //comprobamos si el usuario es el organizador
        if (event.organizer.self !== undefined){
          //si lo es comprobamos si hay mas invitados en el evento
          if(event.attendees!== undefined && event.attendees.length){
            //si hay mas invitados entonces verificar que el creador lo haya aceptado
             const find =  event.attendees.find( (item: any) => {
               return item.responseStatus === "accepted" && item.self != undefined;
             })
            //si lo encuentra entonces poner en true
            if (find) next = true;
          }else {
            //si solo es el organizador
            next = true;
          }
        }

        if (!next){
          //si el no es el organizador pero el acepta el evento
          if(event.attendees!== undefined && event.attendees.length) {
            event.attendees.forEach((item: any) => {
              if (item.self !== undefined && item.responseStatus == "accepted") next = true;
            });
          }
        }



        if (!next) return;

        //date start with hour
        let start = event.start.dateTime;
        if (!start) start = event.start.date;

        //date end with hour
        let end = event.end.dateTime;
        if(!end) end = event.end.date;

        //transform valur to moments
        const startF = moment(start);
        const endF =  moment(end);
        const duration = moment.duration(endF.diff(startF));

        const detail = event.summary.substring(( event.summary.indexOf(":") + 1));
        const project = event.summary.substring(1, event.summary.indexOf(":"));

        //format dates
        previewObject.dateStart =  startF.format('DD/MM/YYYY HH:mm');
        previewObject.dateEnd =  endF.format('DD/MM/YYYY HH:mm');
        previewObject.hours = duration.asHours();
        previewObject.detail = detail.trim();
        previewObject.project = project.trim();
        previewObject.email = this.emailNow;

        this.infoProjects.push(previewObject);
      }
    }catch (e) {
      console.log(e)
    }
  }

  getClass(step: any){
    if (this.steps == step) return "arrow";
    if (this.steps > this.steps) return "arrow-green";
    return "arrow-gray";
  }


}
</script>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.1/css/font-awesome.css" integrity="sha512-bf5lgyUrZOfPh94XyXFK4+2062lAMQFAfxUTVkOAHZ7R3XQ0tY+TUSkbqt8sjFsq0hVMKvGT/1P39c+vKwesTQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<style scoped>
  .bg-orange-300{
    background-color: #E64A19 !important;
    color: white !important;
  }
  .text-red{
    color: red !important;
  }
  .btn-purple{
    background-color: #643FED;
    color: white;
    border-radius: 50px !important;
  }
  .circle {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    padding: 6px;
    border: 2px solid #8B9298;
    color: #8B9298;
    text-align: center;
    font: 12px Arial, sans-serif;
    margin-right: 10px;
    margin-left: 10px;
  }
  .circle-muted {
    border-radius: 50%;
    width: 36px;
    height: 36px;
    padding: 6px;
    background: #fff;
    border: 2px solid #d1d1d1;
    color: #d1d1d1;
    text-align: center;
    font: 18px Arial, sans-serif;
    margin-left: 8px;
  }

  .arrow:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 17px solid white;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
  }
  .arrow {
    background-color: #006560;
    width: 100%;
    height: 26px;
    display: inline-block;
    position: relative;
  }

  .arrow p {
    color: white;
  }

  .arrow:before {
    color: #006560;
    border-left: 13px solid;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    display: inline-block;
    content: '';
    position: absolute;
    right: -13px;
  }

  .arrow-gray {
    background-color: #DDDDDE;
    width: 100%;
    height: 26px;
    display: inline-block;
    position: relative;
    font-weight: bold;
  }

  .arrow-gray:before {
    color: #DDDDDE;
    border-left: 13px solid;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    display: inline-block;
    content: '';
    position: absolute;
    right: -13px;
  }

  .arrow-gray:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 17px solid white;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
  }

  .arrow-green {
    height: 26px;
    position: relative;
    background: #8FC02B;
    font-weight: bold;
  }

  .arrow-green p{
    color: white;
  }

  .arrow-green:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 17px solid white;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
  }

  .arrow-green:before {
    color: #8FC02B;
    border-left: 13px solid;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    display: inline-block;
    content: '';
    position: absolute;
    right: -13px;
  }

  .arrow-green-square {
    height: 26px;
    position: relative;
    background: #8FC02B;
    font-weight: bold;
  }

  .arrow-green-square p{
    color: white;
  }

  .arrow-green-square:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 0px solid white;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
  }

  .arrow-green-square:before {
    color: #8FC02B;
    border-left: 13px solid;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    display: inline-block;
    content: '';
    position: absolute;
    right: -13px;
  }


  .arrow-square:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 0px solid white;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
  }
  .arrow-square {
    background-color: #006560;
    width: 100%;
    height: 26px;
    display: inline-block;
    position: relative;
  }

  .arrow-square p {
    color: white;
  }

  .arrow-square:before {
    color: #006560;
    border-left: 13px solid;
    border-top: 13px solid transparent;
    border-bottom: 13px solid transparent;
    display: inline-block;
    content: '';
    position: absolute;
    right: -13px;
  }

  .tableFixHead          { overflow: auto; height: 400px; }
  .tableFixHead thead th { position: sticky; top: 0; z-index: 1; }

  /* Just common table stuff. Really. */
  table  { border-collapse: collapse; width: 100%; }
  th, td { padding: 8px 16px; }
  th     { background:#eee; }

  .paragraphs-home{
    font-size: 0.6em !important;
    font-family: IBM Plex Sans Condensed;
    color: #50504f;
    text-align: left;
    font-weight: 600;
  }

  .container-home {
    background: #FFFFFF;
    width: 100%;
    padding-right: 4%;
    padding-left: 4%;
    padding-top: 2%;
    padding-bottom: 2%;
    margin-right: auto;
    margin-left: auto;
  }

  .title {
    text-align: left;
  }

  .font-size-title {
    /* padding-left: 1.5%; */
    font-size: 0.9em;
    font-weight: 500;
  }

  .font-button {
    font-size: 0.6em;
  }

  .btn-custom-green{
    border-color: #8FC02B !important;
    color: #8FC02B !important;
  }

  .btn-custom-green:hover{
    background-color: white;
  }


</style>
