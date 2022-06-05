<template>

  <div class="container-home-dos" style="background: #FFFFFF;">
    <br>
    <div class="bg-admin">
      <h1 class="title-home pd">
        Vacaciones y ausencias
      </h1>
      <div class="grid-vacation">
        <div class="grid-one-v">
          <div class="card card-shadow height-card">
            <div class="card-body">
              <hr class="hr">
              <p class="p-admin">MIS VACACIONES </p>
              <h2 style="text-align:left;color: #a5acb2;">{{parseFloat(util.days_generated)}} días disponibles</h2>
              <p class="p-admin" style="color: #6C757D !important;">Válidos hasta el [31/03/{{year + 1}}]</p>
              <a @click="type = 1" class="btn btn-outline-btn-vacation" :class="type == 1 ? 'active' : ''"><i></i> Solicitar vacaciones o ausencia <i class="fas fa-angle-right"></i></a>
              <a @click="type = 2" class="btn btn-outline-btn-vacation" :class="type == 2 ? 'active' : ''"><i></i> Mi historial <i class="fas fa-angle-right"></i></a>
            </div>
          </div>
        </div>
        <div class="grid-two-v">
          <div class="card card-shadow height-card" v-show="type == 1">
            <div class="card-body" >
              <div class="loading" v-show="loading">
              </div>
              <div v-show="!loading">
                <div class="title-one-card-vacation">
                  <p class="p-title-one-card-vacation">Solicitar vacaciones o ausencia</p>
                  <div class="triangulo_der">
                  </div>
                </div>

                <hr class="hr">
                <p class="p-admin" style="color: #6C757D !important;">Solicita :</p>
                <p style="color: #000;" class="pd-text text-al text-f fw">{{user.name}}</p>
                <p style="color: #000;" class="pd-text text-al text-f">{{user.position.name}} / {{user.organizacion}} </p>
                <p class="p-admin pd-text" style="color: #6C757D !important;">Supervisor(a) :</p>
                <p style="color: #000;" class="pd-text text-al text-f fw">
                  <template v-if="(user.supervisors).length > 0">
                    <template v-for="s in user.supervisors">
                      {{s.name}}
                    </template>
                  </template>
                  <template v-else>
                    N/A
                  </template>
                </p>
                <hr class="hr">
                <div class="grid-inputs-one">
                  <div class="form-group text-al">
                    <label class="fw">Tipo de ausencia</label>
                    <select v-model="typerequest" class="form-control" @click="countWorkDay">
                      <option value="0">Selecciona una opción</option>
                      <option value="1">Vacaciones</option>
                      <option value="2">Vacaciones (medio turno)</option>
                      <option value="3">Enfermedad</option>
                      <option value="4">Otro</option>
                    </select>
                    <input v-if="typerequest == 4" v-model="commentother" type="text" class="form-control" placeholder="Escriba un comentario" style="margin-top: 2%;">
                  </div>
                  <div class="form-group text-al">
                    <label class="fw">Rango de fechas</label>
                    <div class="grid-inputs-two">
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" style="font-size:small;">Inicio:</span>
                        </div>
                        <input v-model="datestart" @change="countWorkDay" type="date" class="form-control" style="font-size: small;">
                      </div>
                      <div class="input-group mb-3">
                        <div class="input-group-prepend">
                          <span class="input-group-text" style="font-size:small;">Fin:</span>
                        </div>
                        <input v-model="dateend" @change="countWorkDay" type="date" class="form-control" style="font-size: small;">
                      </div>
                      <!-- <input v-model="datestart" @change="countWorkDay" type="date" class="form-control" placeholder="Example input"> -->
                      <!-- <input v-model="dateend" @change="countWorkDay" type="date" class="form-control" placeholder="Example input"> -->
                    </div>
                    <label style="font-size: smaller; margin-top: 0; margin-bottom: 0; padding: 0;color: #319397;font-weight: bold;"><span>⚠</span> Se reducirán {{daysholidays}} días. Tras la aprobación, tus días disponibles serán {{parseFloat(util.days_generated) - daysholidays}}</label>
                  </div>

                </div>
                <div class="form-group text-al">
                  <label class="fw">Comentario</label>
                  <textarea class="form-control"
                  v-model="comment"
                  rows="3"></textarea>
                </div>
                <div class="grid-inputs-two m-lr" style="gap: 4%;" v-show="util.days_generated > 0">
                  <button @click="requestHoliday" type="button" class="btn btn-outline-success btn-rounded">
                    <img src="images/Solicitar.png">
                    Solicitar
                  </button>
                  <button @click="vaciar" type="button" class="btn btn-outline-danger btn-rounded">
                    <img src="images/cancelar.png">
                    Cancelar
                  </button>
                </div>
              </div>

            </div>
          </div>
          <vacation-history :userId="user.id" :year="year" :origin="'user'" v-if="type == 2"></vacation-history>
        </div>
      </div>
    </div>


  </div>

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {Modal} from "ant-design-vue";
import axios from "axios";
import VacationHistory from "@/views/vacation/VacationHistory.vue";
import moment from "moment";

@Component({
  components: {VacationHistory }
})

export default class Welcome extends Vue {
  user: any = "";
  type = 0;
  util: any = "";
  year = moment().year();

  comment: any = "";
  typerequest = 0;
  datestart = "";
  dateend = "";
  daysuse: any = [];
  daysholidays = 0;
  loading = false;
  commentother = "";

  async mounted() {
    this.user = this.$store.state.user;
    this.daysUtil();
  }

  async daysUtil(){
    const daysutil = await axios.get('/api/user-vacation-util/' + this.$store.state.user.id + '&' + this.year);
    this.util = daysutil!.data;
  }

  stringToDate(dateStringg: any){
    const dateString = dateStringg.split('-');
    return new Date(dateString[0], dateString[1] - 1, dateString[2]);
  }

  countWorkDay(){
    if (this.typerequest != 4) {
      this.commentother = "";
    }
    if (this.datestart != "" && this.dateend != "") {
      // Agregamos validacion de fechas
      if(this.datestart > this.dateend){
        this.showError("La fecha inicial no puede ser mayor a la fecha fin");
        this.datestart = "";
        this.dateend = "";
        this.daysholidays = 0;
        return;
      }

      let date1: any = this.stringToDate(this.datestart);
      const date2: any = this.stringToDate(this.dateend);
      const delta: any = (date2-date1) / (1000 * 60 * 60 * 24) + 1; // calcula el tiempo total

      let weeks = 0;
      // Iteramos el numero total de dias
      for(let i = 0; i < delta; i++){

        if (date1.getDay () == 0 || date1.getDay () == 6){
          weeks ++; // agrega 1 si es sábado o domingo
        }else{
          let month = '' + (date1.getMonth() + 1);
          let day = '' + date1.getDate();
          const year = date1.getFullYear();

          if (month.length < 2)
          month = '0' + month;
          if (day.length < 2)
          day = '0' + day;

          this.daysuse.push([year, month, day].join('-'));
        }
        date1 = date1.valueOf();
        date1 += 1000 * 60 * 60 * 24;
        date1 = new Date(date1);
      }
      const result = delta - weeks;
      this.daysholidays = this.typerequest == 2 ? (0.5 * result) : result;
      if (this.daysholidays > this.util.days_generated) {
        this.showError("No se puede exeder los dias solicitados a los dias disponibles");
        this.dateend = "";
        this.daysholidays = 0;
        return;
      }
      // Validamos que se seleccione mas de 1/2 dia
      if(this.daysholidays == 0){
        this.showError("Se debe solicitar al menos 1/2 dia");
        this.datestart = "";
        this.dateend = "";
        return;
      }
      this.comment = this.user.name + ", quien suscribe este correo, solicita el uso de "+ this.daysholidays +" días de vacaciones (restando " + this.daysholidays + " días de los " + this.util.days_generated + " días que tengo disponibles correspondientes a los días generados en " + this.year + ")"+". Esta solicitud ya ha sido platicada y acordada con mi supervisor[a], "
      + ((this.user['supervisors']).length == 0 ? "" : this.user['supervisors'][0].name);
    }
  }

  vaciar() {
    this.typerequest = 0;
    this.comment = "";
    this.datestart = "";
    this.dateend = "";
    this.daysuse = [];
    this.daysholidays = 0;
    this.commentother = "";
  }

  showAlert(title: string) {
    const confirm = Modal.info;
    confirm({
      title: title ,
      content: '',
      okText: 'Aceptar',
    });
  }

  showError(title: string) {
    const confirm = Modal.error;
    confirm({
      title: title ,
      content: '',
      okText: 'Aceptar',
    });
  }

  async requestHoliday() {
    if (this.typerequest == 0) {
      this.showAlert("El tipo de ausencia es requerido");
      return;
    }
    if (this.datestart == "" && this.dateend == "") {
      this.showAlert("La fecha de inicio y fin es requerida");
      return;
    }
    if (this.comment == "") {
      this.showAlert("El comentario es requerido");
      return;
    }

    this.loading = true;
    const result: any = await axios.post('/api/send-request-holiday',
    { userid : this.user.id,
      detailid : this.util.id,
      supervisorid : this.user.supervisors[0].id,
      type : this.typerequest,
      datestart : this.datestart,
      dateend : this.dateend,
      comment: this.comment,
      daysuse: this.daysuse,
      daysholidays: this.daysholidays,
      year : this.year,
      commentother : this.commentother,
    });
    if (result.data.status == true) {
      this.daysUtil();
      this.vaciar();
      this.loading = false;
    }
    const success = Modal.success;
    success({
      title: "Tu solicitud se ha enviado exitosamente" ,
      content: '',
      okText: 'Aceptar',
    });
  }
}
</script>
<style media="screen">
.img-w {
  background-image: url("/assets/images/Image.png");
  height: 90vh;
  background-repeat: no-repeat;
  background-position: center top;
  padding-bottom: 10%;
}

.custom-h1{
  font-size: 2.5em !important;
  font-family: IBM Plex Sans Condensed;
  color: #50504f;
  font-weight: 600;
}

.pd {
  padding-left: 6%;
}

.pd-text {
  margin-top: -2%;
}

.height-card {
  height: 100%;
}

.bg-admin {
  background-image: url("/assets/images/Image.png");
  background-repeat: no-repeat;
  background-position: 24em top;
  height: 88vh;
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .bg-admin {
    background-position: 18em top;
    height: 74vh;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .bg-admin {
    background-position: 6em top;
    height: 74vh;
  }
}

@media (max-width: 768px) {
  .bg-admin {
    background-position: -6em top;
    height: 74vh;
  }

}

.grid-vacation {
  display: grid;
  grid-template-columns: 26% 74%;
  height: 80%;
}

.grid-one-v {
  margin-left: 20%;
}

.grid-two-v {
  margin-left: 4%;
  margin-right: 20%;
}

.grid-inputs-one {
  display: grid;
  grid-template-columns: 32% 68%;
  gap : 5px;
}

.grid-inputs-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.grid-buttons{
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 50%;
}

.hr {
  margin-top: 2%;
  margin-bottom: 2%;
  background: #000000;
}

.p-admin {
  font-size: 1em;
  font-weight: 600;
  color: #27282a;
  text-align: left;
}

.btn-outline-btn-vacation {
  margin-top: 4%;
  font-size: 85%;
  border-radius: 20px;
  height: auto;
  width: 100%;
  text-align: center;
  background-color: transparent;
  background-image: none;
  border-color: #310981;
  color: #310981 !important;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-outline-btn-vacation.active{
  background-color: #310981 !important;
  color: #FFFFFF !important;
}

.btn-outline-btn-vacation:hover {
  background-color: #310981;
  color: #FFFFFF !important;
}

.btn-outline-btn-vacation:checked {
  background-color: pink;
}

.title-one-card-vacation {
  display: grid;
  grid-template-columns:  95% 10%;
}

.p-title-one-card-vacation {
  background: #310981;
  margin: 0;
  padding: 1%;
  text-align: left;
  font-weight: 600;
  color: #fff;
}

.triangulo_der {
  width: 0;
  /* height: 0; */
  border-top: 20px solid transparent;
  border-left: 14px solid #310981;
  border-bottom: 20px solid transparent;
}

.text-al {
  text-align: left;
}

.text-f {
  font-size : 0.9em;
}

.fw {
  font-weight: 600;
}

.m-lr {
  margin-left: 6%;
  margin-right: 6%;
}

.btn-rounded {
  border-radius: 20px !important;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.btn-w {
  width: 100%;
}

.btn-pd {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.btn-left {
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
.btn-center {
  border-radius: 0;
}
.btn-right {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

tr td {
  border: 0px !important;
}
</style>
