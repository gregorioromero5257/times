
<template>
 <!--  <div>
    <br>
    <div class="container">
      <div class="row">
        <div class="col-lg-2"></div>
        <div class="col-lg-8"><h2>Bienvenido a timeworks {{userName}}</h2></div>
        <div class="col-lg-2"></div>
      </div>
      <br>
      <br>
      <div class="row">
        <div class="col-lg-4"></div>
        <div class="col-lg-4">
          <button class="btn btn-success" v-if="!authorized" @click="handleAuthClick">Obtener tiempos</button>
          <button class="btn btn-success" v-if="authorized" @click="timeRegister">Tiempos registrados</button>
          </div>
        <div class="col-lg-4"></div>
      </div>
      <br>
      <br>
      <div class="row" v-if="!authorized">
        <div class="col-lg-2"></div>
        <div class="col-lg-8">
          <table class="table table" v-if="!info">
            <thead>
              <th scope="col">Codigo de proyecto</th>
              <th scope="col">Detalle</th>
              <th scope="col">Fecha de ejecucion</th>
              <th sope="col">Tiempo destinado</th>
            </thead>
            <tbody>
             <td colspan="4">
               <h1> Aún no hay datos disponibles</h1>
             </td>
            </tbody>
          </table>
          <table class="table" v-else>
            <thead>
              <th scope="col">Codigo de proyecto</th>
              <th scope="col">Detalle</th>
              <th scope="col">Fecha inicial</th>
              <th scope="col">Fecha final</th>
              <th sope="col">Tiempo destinado</th>
            </thead>
            <tbody>
              <tr v-for="(inf, index) in info" :key="index">
                <td> {{inf.project.name}} </td>
                <td> {{inf.description}} </td>
                <td> {{inf.startDate}} </td>
                <td> {{inf.endDate}} </td>
                <td> {{inf.hours}} </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col-lg-2"></div>
      </div>
    </div>

    <div class="container" v-if="authorized && controlTime">
      <div class="row">
        <table class="table table-bordered">
          <thead>
            <th scope="col">Codigo de proyecto</th>
            <th scope="col">Detalle</th>
            <th scope="col">Fecha de ejecucion</th>
            <th sope="col">Tiempo destinado</th>
          </thead>
          <tbody>
            <tr v-for="(project, index ) in hourProject" :key="index">
              <td>{{project.project}}</td>
              <td>{{project.detail}}</td>
              <td>{{project.stringStart}} - {{project.stringEnd}}</td>
              <td>{{project.hours}} Horas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row" v-if="hourProject.length > 0 && authorized">
      <div class="col-sm">
        <button class="btn success" @click="sendInfo">Registrar tiempo</button>
      </div>
    </div>
  </div> -->
 <div id="main-wrapper">
        <!--************************************** Header Section************************************** -->
        <header class="topbar">
            <nav class="navbar top-navbar navbar-expand-md navbar-light">
                <div class="navbar-header">
                    <a class="navbar-brand" href="index.html" style="padding-left: 24px;">
                        <span>
                            <img src="assets/images/LOGO BLANCO.png"  height="59px" width="128px">
                        </span>
                    </a>
                </div>
                <div class="navbar-collapse">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item"> <a class="nav-link nav-toggler hidden-md-up waves-effect waves-dark" href="javascript:void(0)"><i class="ti-menu"></i></a> </li>
                    </ul>
<!--                    <ul class="navbar-nav my-lg-0">
                        <li class="nav-item">
                            <a class="nav-link waves-effect waves-dark" style="font-family: IBMPlexSansCond-Bold;
                            font-size: 16px;
                            color: #FFFFFF;" href="#">
                                Registros
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link waves-effect waves-dark" style="font-family: IBMPlexSansCond-Bold;
                            font-size: 16px;
                            color: #FFFFFF;" href="#">
                                Reportes
                            </a>
                        </li>
                    </ul>-->
                    <ul class="navbar-nav my-lg-0">
                        <li class="nav-item">
                            <button type="button" class="btn btn-sm btn-outline-warning" style="border: 2px solid;
                            border-radius: 5px;
                            border-radius: 5px;">Cerrar Sesión</button>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
        <!--************************************** END Header Section************************************** -->
        <!--**************************************  Sidebar Section************************************** -->
        <aside class="left-sidebar">
            <nav class="sidebar-nav">
                <ul id="sidebarnav">
                    <li style="    margin-left: 55px;
                    margin-right: 55px;">
                        <span class="hide-menu" style="font-family: IBMPlexSansCond-Medium;
                        font-size: 35px;
                        color: #FFFFFF;">
                           ¡Bienvenido(a) a TimeWorks,
                        </span>
                        <span class="hide-menu" style="font-family: IBMPlexSansCond-Medium;
                        font-size: 35px;
                        color: #FFFFFF;">
                             (Nombre)!
                        </span>
                    </li>
                    <br>
                    <br>
                    <li style="margin-left: 55px;
                    margin-right: 55px;">
                        <span class="hide-menu">
                            <button type="button"  class="btn btn-sm btn-outline-info">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tiempos registrados &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </button>
                        </span>
                    </li>
                    <br>
                    <li style="margin-left: 55px;
                    margin-right: 55px;">
                        <span class="hide-menu">
                            <button type="button"  class="btn btn-sm btn-outline-info">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Obtener tiempos &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            </button>
                        </span>
                    </li>
                </ul>
            </nav>
            <div class="scroll-sidebar"></div>
        </aside>
        <!--************************************** END Sidebar Section************************************** -->
        <!--**************************************  Container Section************************************** -->
        <div class="page-wrapper">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <h3 style="font-family: IBMPlexSansCond-Medium;
                                font-size: 35px;
                                color: #34247E" >Registros (Tiempos registrados)</h3>
                                <br>
                                <table class="table">
                                    <thead style="background: #F4F7F9;">
                                        <tr style="font-family: IBMPlexSansCond-Bold;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);
                                        text-align: center " >
                                            <th scope="col">Código de proyecto</th>
                                            <th scope="col">Detalle</th>
                                            <th scope="col">Inicio</th>
                                            <th scope="col">Fin</th>
                                            <th scope="col">Tiempo destinado(horas)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style=" font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                            <td style="border-bottom: 1px solid #979797;">Mark</td>
                                            <td style="border-bottom: 1px solid #979797;">Otto</td>
                                            <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                            <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                            <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                        <tr style="font-family: IBMPlexSansCond;
                                        font-size: 18px;
                                        color: rgba(0,0,0,0.85);">
                                        <td style="border-bottom: 1px solid #979797;">Mark</td>
                                        <td style="border-bottom: 1px solid #979797;">Otto</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        <td style="border-bottom: 1px solid #979797;">@mdo</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--************************************** END Container Section************************************** -->
    </div>
        <!--************************************** END Container Section************************************** -->
</template>

<script lang="ts" >
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, Prop, Vue } from "vue-property-decorator";
import Proxy from "../helpers/proxy";
import moment from "moment";
import axios from "axios";
/* import XLSX from "xlsx"; */
axios.defaults.url = Proxy.api.domain;
declare const gapi: any;

@Component
export default class Index extends Vue {
  @Prop() private msg!: string;
  // Client ID and API key from the Developer Console
  CLIENT_ID =
    "438182473804-lold6v82v1m26dht1dr3j58e0tmbjg3g.apps.googleusercontent.com";
  API_KEY = "AIzaSyC2eQA62ImF7GlMuscwl26zg2X0_dBkIcY";

  // Array of API discovery doc URLs for APIs used by the quickstart
  DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ];
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
  API_Domain = Proxy.api.domain;
  authorized = false;
  controlTime = true;
  items: undefined;
  dataCalendar!: Array<string>;
  infoCalendar: Array<any> = [];
  indexData!: Array<number>;
  startInfo!: Array<undefined>;
  hourProject: Array<any> = [];
  info:  Array<any> = [];
  async created() {
    await this.handleClientLoad();
    await this.initialInfo();

  }
  get userName(){
    return this['$store'].state.user.name
  }
  async initialInfo(){
    const id = this['$store'].state.user.id;
    const info = await axios.get('/api/projecttimeworkuser/'+id);
    this.info = info.data;
  }
  timeRegister(){
    this.authorized = false;
  }
  /**
   * Send info from API
   */
  async sendInfo() {
    try {
      const sendTime = await axios.post("/api/projecttimeworkuser",
        this.hourProject
      );
      this.initialInfo();
      this.authorized = false;
      this.controlTime = false;
      this.hourProject = [];
    } catch (error) {
      console.error(error);
    }
  }
  /**
   *  On load, called to load the auth2 library and API client library.
   */
  handleClientLoad() {
    gapi.load("client:auth2", this.initClient);
  }
  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  async initClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: this.DISCOVERY_DOCS,
      scope: this.SCOPES
    });
    gapi.auth2.getAuthInstance().isSignedIn.listen();
  }

  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick() {
    if(this.hourProject.length != 0){
      this.authorized = true;
    }
    else{
     Promise.resolve(gapi.auth2.getAuthInstance().signIn()).then(res => {
        this.authorized = true;
        this.getData();
      });
    }
  }
  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick() {
    Promise.resolve(gapi.auth2.getAuthInstance().signOut()).then(res => {
      this.authorized = false;
    });
  }

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   * 'maxResults': 10,
   */
  async getData() {
    this.controlTime = false;
    this.infoCalendar = [];
    this.hourProject = [];
    const calendars = await gapi.client.calendar.calendarList.list();

    const listCalendar = calendars.result.items;
    const initial  = this.getInitialDay();
    const final = moment().toISOString();
     /*  timeMin: "2020-06-28T21:58:47.617Z",
      timeMax: "2020-09-02T21:58:47.617Z", */
    for (let index = 0; index < listCalendar.length; index++) {
      const calendarId = listCalendar[index].id;

      const info = await gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: initial,
        timeMax: final,
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime"
      });
      this.infoCalendar.push(info.result.items);
    }
    this.calculationHours();
  }

   getInitialDay(){
    const date = moment().toISOString();
    const dateSeparator = date.split('T');
    const daySeparator = dateSeparator[0].substring(0,8)
    const minTime = daySeparator+'01T00:00:01.001Z';
    return minTime;
  }

  /**
   *
   */

  calculationHours() {
    this.hourProject = [];
    const aux: Array<object> = [];
    for (let index = 0; index < this.infoCalendar.length; index++) {
      for (let j = 0; j < this.infoCalendar[index].length; j++) {
        const element = this.infoCalendar[index][j];
        const projectDetail = element.summary;
        const projectEvaluate = projectDetail.split("#");
        if (projectEvaluate.length > 1) {
          const detailEvaluate = projectEvaluate[1].split(":");
          if (detailEvaluate.length > 1 && element.status == "confirmed") {
            aux.push([index, j]);
          }
        }
      }
    }
    const time: Array<any> = [];
    for (let index = 0; index < aux.length; index++) {
      const indexInfo: Array<any> = [];
      indexInfo.push(aux[index]);
      let startinfo: Array<any> = [];
      startinfo = this.infoCalendar[indexInfo[0][0]];
      let detail: Array<any> = [];
      detail = startinfo[indexInfo[0][1]];
     /*  const indexInfo = aux[index];
      let startinfo: Array<any> = [];
      startinfo = this.infoCalendar[indexInfo[0]];
      let detail: Array<any> = [];
      detail = startinfo[indexInfo[1]];
      time.push(detail); */
    }
    time.forEach(element => {
      const previewObject = {
        hours: 0,
        stringStart: "",
        stringEnd: "",
        dateStart: "",
        dateEnd: "",
        project: "",
        detail: ""
      };

      const datestart = new Date(Date.parse(element.start.dateTime));
      const dateend = new Date(Date.parse(element.end.dateTime));
      const subtraction = dateend.getTime() - datestart.getTime();
      const hoursElapsed = subtraction / 1000 / 60 / 60;
      const summaryClear = element.summary.split("#");
      const cutSummary = summaryClear[1].split(":");
      const project = cutSummary[0];
      const detail = cutSummary[1];

      previewObject.hours = hoursElapsed;
      previewObject.stringStart = moment(String(element.start.dateTime)).format(
        "MM/DD/YYYY hh:mm"
      );
      previewObject.stringEnd = moment(String(element.end.dateTime)).format(
        "MM/DD/YYYY hh:mm"
      );
      previewObject.dateStart = moment(String(element.start.dateTime)).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      previewObject.dateEnd = moment(String(element.end.dateTime)).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      previewObject.project = project;
      previewObject.detail = detail;

      this.hourProject.push(previewObject);
    });
    this.controlTime = true;
  }
}
</script>

<style>
    /* Style menu button */
    .btn.btn-outline-info {
        font-size: 13px;
        border: 2px solid #3FD5A8;
        color: #3FD5A8;
        border-radius: 9px;
    }
    .btn.btn-outline-info:active,
    .btn.btn-outline-info:hover,
    .btn.btn-outline-info:focus {
        background-color: #3FD5A8 !important;
        color: #FFFFFF;
    }
    /* Style close sesion button */
    .btn.btn-outline-warning{
        font-size: 13px;
        border: 2px solid #FA6400;
        color: #FA6400;
        border-radius: 5px;
    }
    .btn.btn-outline-warning:active,
    .btn.btn-outline-warning:hover,
    .btn.btn-outline-warning:focus {
        background-color: #FA6400 !important;
        color: #FFFFFF;
    }
    .btn-primary:not(:disabled):not(.disabled).active,
    .btn-primary:not(:disabled):not(.disabled):active,
    .show > .btn-primary.dropdown-toggle {
    background-color: orange;
    }
</style>
