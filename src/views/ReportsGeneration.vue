<template>
  <div class="container-home-dos">
    <!-- <div class="row"> -->
    <!-- <div class="col-lg-12 col-md-12"> -->
    <div class="card">
      <!-- <h1 class="title-home">Generación de reportes</h1> -->
      <div class="card-body card-shadow">

        <div class="flex-head">
          <label style="color: #6C757D;font-weight: 700;font-size: 1.2em;padding-right : 0;">Mes :</label>
          <div style="padding : 0;">
            <month-picker-input @change="showDate"  :input-pre-filled="true" :default-month="month" :default-year="year" lang="es"></month-picker-input>
          </div>
        </div>
        <div class="row mt-2">
          <div class="table-responsive">
            <table class="table">
              <thead style="background-color: rgb(242, 246, 248) ">
                <tr>
                  <th scope="col">Nombre del colaborador</th>
                  <th scope="col">Estatus de reporte</th>
                  <th width="10%" scope="col">Número de versión</th>
                  <th scope="col">Excel</th>
                  <th scope="col">PDF</th>
                  <!-- <th scope="col">Marcar como finalizado</th> -->
                  <th scope="col">Archivo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in data" :key="index">
                  <td style="text-align: left;">{{ item.name }}</td>
                  <td style="text-align: left;">
                    <div class="badge badge-default badge-outlined" v-if="item.status === 'Pendiente'">{{item.status}}</div>
                    <div class="badge badge-success badge-outlined" v-if="item.status === 'Enviado'">{{item.status}}</div>
                    <div class="badge badge-info badge-outlined" v-if="item.status === 'Finalizado'">{{item.status}}</div>
                    <!-- <img :src="getImageStatus(item.status)" alt=""> {{ item.status }} -->
                  </td>
                  <td>{{ item.version }}</td>
                  <td>
                    <a>
                      <img @click="generateExcel(index)" v-if="!data[index].loading" :src="getImageDownload(item, 'excel')" alt="">
                      <rotate-square2 size="20px" v-if="data[index].loading"></rotate-square2>
                    </a>
                  </td>
                  <td>
                    <a>
                      <img @click="generatePdf(index)" v-if="!data[index].loading" :src="getImageDownload(item, 'pdf')" alt="">
                      <rotate-square2 size="20px" v-if="data[index].loading"></rotate-square2>
                    </a>
                  </td>
                  <!-- <td>
                  <input type="checkbox" :disabled="item.version == 0" v-model="data[index].finished" v-on:change="markAsFinished(index)">
                </td> -->
                <td>

                  <template v-if="data[index].activityId">
                    <template v-if="item.path">
                      <div class="dropdown">
                        <button class="dropdown-toggle btn-outline" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <img src="/images/Final.png" alt="" style="width: 28px; cursor: pointer">
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <!-- @click="dowloadFile(item)" -->
                          <a class="dropdown-item" :href="item.path" target="_blank">Descargar</a>
                          <a class="dropdown-item" @click="openModalForUploadFile(item)" href="#">Remplazar</a>
                          <a class="dropdown-item" @click="deleteFile(item)" href="#">Eliminar</a>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="dropdown">
                        <button class="dropdown-toggle btn-outline" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <img src="/images/Final- inactivo.png" alt="" style="width: 28px; cursor: pointer">
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                          <a class="dropdown-item" @click="openModalForUploadFile(item)" href="#">Cargar Reporte Final</a>
                        </div>
                      </div>
                    </template>
                  </template>
                  <template v-else>
                    <img src="/images/Final- inactivo.png" alt="" style="width: 28px;">
                  </template>
                  <!-- <img v-if="data[index].activityId" @click="openModalForUploadFile(item)" src="/images/icons8-upload-48.png" alt="" style="width: 28px; cursor: pointer">
                  <a target="_blank" v-if="item.path" :href="item.path">
                  <img src="/images/icons8-pdf-40.png" alt="" style="width: 28px; cursor: pointer">
                </a> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

</div>
<!-- </div> -->
<!-- </div> -->
<a-modal width="40em" v-model="showModal" :title="'Subir archivo para : ' + (item == null ? '' : item.name)" >
  <template slot="footer">
    <button class="btn btn-warning" v-if="!loading"  @click="showModal = false; files = [];">
      Cancelar
    </button>
    <button class="btn btn-success" v-if="!loading"  :loading="loading" @click="uploadFile">
      Guardar
    </button>
    <rotate-square2 size="20px" v-if="loading"></rotate-square2>
  </template>

  <div class="card-drop">
    <div class="dropzone">
      <DropZone :enabled="!uploading"
    @filesAdded="onFilesAdded" @filesNew="onfilesNew"/>
    </div>
    <div class="left-side">
      <div class="file-list">
        <h5 style="margin-top:0">Archivos (solo se aceptan PDF)</h5>
        <h6>{{files.name}}</h6>

      </div>
    </div>
  </div>
  <!-- <label>
  <input ref="file" accept="application/pdf"  type="file" @change="handleFileUpload( $event )"/>
</label> -->
</a-modal>
</div>
</template>

<script lang="ts">
import { Component,  Vue} from "vue-property-decorator";
import { MonthPickerInput } from 'vue-month-picker'
import moment from "moment/moment";
import axios from "axios";
import {RotateSquare2} from "vue-loading-spinner";
import {Report} from "@/helpers/interfaces/ReportInterface";
import { Modal } from 'ant-design-vue';
import DropZone from '../components/DropZone.vue';

import XLSX from "xlsx";

@Component({
  components :{
    MonthPickerInput, RotateSquare2, DropZone
  }
})
export default class ReportsGeneration extends Vue{
  month = moment().month() + 1;
  year =  moment().year();
  data: Array<Report> = [];
  showModal = false;
  item: any = null;
  file: any = null;
  loading = false;
  uploading = false;
  files: any = [];


  created(){
    //this.getUsersReports();
  }

  onFilesAdded(files: File[]) {
    this.files = [...files, ...this.files];
    this.files = this.files[this.files.length - 1];
  }

  onfilesNew(){
    this.files = [];
  }

  showDate (date: any) {
    this.year = date.year;
    this.month = date.monthIndex;
    this.getUsersReports();
  }

  openModalForUploadFile(item: any){
    this.item = item;
    this.showModal = true;
  }

  handleFileUpload(event: any){
    this.file = event.target.files[0];
  }
  async uploadFile(){

    this.loading = true;
    if (this.files.length == 0){
      this.showModal = false;
      this.loading = false;
      return;
    }
    const formData = new FormData();
    formData.append('file', this.files);
    formData.append('activity_id', this.item.activityId);
    const response = await axios.post( '/api/upload-report-user', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    await this.markAsFinished(this.item);
    this.loading = false;
    this.files = [];
    this.showModal = false;
    await this.getUsersReports();
  }

  async getUsersReports(){
    const response = await axios.post('/api/reports-generation-monthly', { 'month' : this.month, 'year' : this.year });
    this.data = response.data;
  }

  async markAsFinished(index: any){
    // this.data[index].status = (this.data[index].finished) ? "Finalizado" : "Enviado";
    const params = {
      // "activityId" : this.data[index].activityId,
      "activityId" : index.activityId,
      // "userId" : this.data[index].id,
      "userId" : index.id,
      // "finished" : this.data[index].finished
      "finished" : 1,
    }
    await axios.post('/api/reports-generation-finished', params);

  }

  async generateExcel(index: any){
    const params = {
      "month" : this.month,
      "year" : this.year,
      "userId" : this.data[index].id
    }
    this.data[index].loading =  true;

    try{
      const response = await axios.post('/api/reports-generation-list', params);
      this.data[index].loading =  false;
      const userName = this.data[index].name.replace(/ /g, "_");
      this.createExcel(response.data.data, userName);
    }catch (e) {
      this.data[index].loading =  false;
      console.log(e.message);
    }
  }

  createExcel(data: any, userName: string){

    console.log("crear excel");
    console.log(data);

    const headers = ['colaborador', 'cargo', 'codigo_proyecto', 'descripcion', 'dateStart', 'dateEnd', 'tiempo_estimado' ];
    const excel = XLSX.utils.json_to_sheet(data, {
      header: headers
    })
    excel['A1'].v = 'Colaborador'
    excel['B1'].v = 'Cargo'
    excel['C1'].v = 'Código del Proyecto'
    excel['D1'].v = 'Descripción'
    excel['E1'].v = 'Inicio'
    excel['F1'].v = 'Fin'
    excel['G1'].v = 'Tiempo Estimado (hrs)'
    const workbook = XLSX.utils.book_new()
    const workbookNname = "registros";
    const month = (this.month).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    XLSX.utils.book_append_sheet(workbook, excel, workbookNname);
    const fileName = `${this.year}_${month}_${userName}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  async generatePdf(index: any){
    //window.open(`${endpoint.api.domain}/api/chart?month=${this.month}&year=${this.year}&userId=${this.data[index].id}`, '_blank');
    const params = {
      "month" : this.month,
      "year" : this.year,
      "userId" : this.data[index].id
    }
    this.data[index].loading =  true;
    try {
      const response = await axios.post('/api/user-registers-report', params);
      this.data[index].loading =  false;
      if (response.data.success){
        window.open(response.data.path, '_blank');
      }else{
        const success = Modal.error;
        success({
          title: "No se ha podido generar el pdf correctamente" ,
          content: '',
          okText: 'Aceptar',
        });
      }
    }catch (e) {
      this.data[index].loading =  false;
      const success = Modal.error;
      success({
        title: "No se ha podido generar el pdf correctamente" ,
        content: '',
        okText: 'Aceptar',
      });
    }

  }

  async deleteFile(data: any){
    const params = {
      "activityId" : data.activityId,
      "userId" : data.id,
      // "finished" : 1,
    }
    const response = await axios.post('/api/delete-report-file', params);
    await this.getUsersReports();

  }

  getImageDownload(item: any, type: any){
    return (item.version == 0)
    ? ((type === 'excel') ? "/images/Excel- inactivo.png" : (type === 'pdf') ? "/images/PDF- inactivo.png" : "")
    : ((type === 'excel') ? "/images/Excel.png" : (type === 'pdf') ? "/images/PDF.png" : "") ;
  }


  getImageStatus(status: string){
    switch (status) {
      case "Pendiente" :
      return "/images/reporte_pendiente.png";
      case "Enviado" :
      return "/images/reporte_enviado.png";
      case "Finalizado" :
      return "/images/reporte_finalizado.png";
    }
    return "/images/reporte_pendiente.png";
  }
}
</script>

<style>
.month-picker__container{
  background-color: white !important;
}
.custom-control-label::before,
.custom-control-label::after {
  top: .8rem;
  width: 1.25rem;
  height: 1.25rem;
}

table td {
  border-top : 1px solid #737373 !important;
}

.table thead th {
  text-align : left;
  vertical-align: baseline;
}

.dropdown, .dropleft, .dropright, .dropup {
  position: initial;
}

.btn-outline {
  border: 0;
  background: transparent;
}

.container-home-dos {
  background: #FFFFFF;
  width: 100%;
  padding-right: 1%;
  padding-left: 1%;
  padding-top: 2%;
  padding-bottom: 2%;
  margin-right: auto;
  margin-left: auto;
}

.flex-head {
  display: flex;
  justify-content: flex-start;
  gap: 4%;
  align-items: center;
}

.card-drop {
  background: #fff;
  border-radius: 2px;
  display: flex;
  /* height: 50%; */
  /* width: 50%; */
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  padding: 8px;
  box-sizing: border-box;
  align-self: center;
}

</style>
<style>

.dropzone {
  width: 65%;
  float: left;
}
.file-list {
  float: left;
  padding-left: 16px;
  box-sizing: border-box;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  margin-bottom: 16px;
}
.left-side {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}
</style>
