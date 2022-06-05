<template>
  <!-- <div> -->
  <div class="container-fluid" style="background: #FFFFFF;">
    <div class="grid-buttons">
      <button type="button" @click="year = 2022;" class="btn btn-outline-info btn-left btn-w btn-pd fw" :class="year == 2022 ? 'active' : ''">2022</button>
      <button type="button" @click="year = 2023;" class="btn btn-outline-info btn-center btn-w btn-pd fw" :class="year == 2023 ? 'active' : ''">2023</button>
      <button type="button" @click="year = 2024;" class="btn btn-outline-info btn-right btn-w btn-pd fw" :class="year == 2024 ? 'active' : ''">2024</button>
    </div>
    <br>
    <div class="grid-check">
      <div class="list-org">
        <label class="container-check fw">
          Organizaciones:
        </label>
        <label class="container-check ">C230 Consultores
          <input v-model="checkboxOrgCm" type="checkbox">
          <span class="checkmark"></span>
        </label>
        <label class="container-check ">Fundación IDEA
          <input v-model="checkboxOrgFi" type="checkbox">
          <span class="checkmark"></span>
        </label>
        <label class="container-check ">C230 Consulting
          <input v-model="checkboxOrgCu" type="checkbox">
          <span class="checkmark"></span>
        </label>
        <label class="container-check ">Supernova
          <input v-model="checkboxOrgSu" type="checkbox">
          <span class="checkmark"></span>
        </label>
      </div>
      <div class="empty-space">
      </div>
    </div>


    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr class="table-info-new">
            <th width="20%" scope="col" class="fh">
              <div style="color: #3d70b3;">
                Nombre del colaborador
              </div>
              <div style="color: rgb(72 148 183 / 1);">
                Cargo
              </div>
            </th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Organización </th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Fecha de ingreso</th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Días generados</th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Vacaciones fijas</th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Vacaciones flexibles</th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Días disponibles</th>
            <th scope="col" class="fh" style="color: #3d70b3; ">Estatus</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="data.length == 0">
            <div class="loading">
            </div>
          </template>
          <template v-for="(t, index) in data" >
            <tr :key="t.id" class="text-al border-n" :style="t.id == idNav ? 'background: #f0f6ff;' : ''">
              <template v-if="t.organizacion != null">
                <template v-if="
                (checkboxOrgCm == true && (t.organizacion).search('C230 Consultores') >= 0)
                || (checkboxOrgFi == true && (t.organizacion).search('IDEA') >= 0)
                || (checkboxOrgCu == true && (t.organizacion).search('C230 Consulting') >= 0)
                || (checkboxOrgSu == true && (t.organizacion).search('Supernova') >= 0)">
                <td class="fw">
                  <button v-show="t.id != idNav" class="btn btn-sm" @click="idNav = t.id;dataRequest = null;request = [];navOption = 1;" style="background-color: transparent !important;"><i class="fa fa-angle-down"></i></button>
                  <button v-show="t.id == idNav" class="btn btn-sm" @click="idNav = 0;" style="background-color: transparent !important;"><i class="fa fa-angle-up"></i></button>
                  {{t.name}}
                </td>
                <td>{{t.organizacion}}</td>
                <td>{{t.date_in}}</td>
                <template v-for="(detail, index) in t.vacationabsencesdetail">
                  <template v-if="detail.active == 1">
                    <td :key="'one' + index">{{parseFloat(detail.flexible_holidays) + parseFloat(detail.permanent_holidays) + (parseFloat(detail.days_replacement))}}</td>
                    <td :key="'two' + index">{{parseFloat(detail.permanent_holidays)}}</td>
                    <td :key="'three' + index">{{parseFloat(detail.flexible_holidays)}}</td>
                    <td :key="'four' + index">{{parseFloat(detail.days_generated)}}</td>
                  </template>
                </template>
                <td></td>
              </template>
            </template>
          </tr>
          <!-- Chid -->
          <tr v-show="t.id == idNav" :key="'child' + index" style="background: #f0f6ff;">
            <template v-if="t.organizacion != null">
              <!-- Filter companies -->
              <template v-if="
              (checkboxOrgCm == true && (t.organizacion).search('C230 Consultores') >= 0)
              || (checkboxOrgFi == true && (t.organizacion).search('IDEA') >= 0)
              || (checkboxOrgCu == true && (t.organizacion).search('C230 Consulting') >= 0)
              || (checkboxOrgSu == true && (t.organizacion).search('Supernova') >= 0)">

              <td colspan="8" style="border: 1px solid red;">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li class="nav-item" role="presentation">
                    <a class="nav-link" :class="navOption == 1 ? 'active' : ''" @click="navOption = 1;" data-toggle="pill" href="#pills-home" role="tab" aria-controls="pills-home" aria-selected="true">Historial</a>
                  </li>
                  <li class="nav-item" role="presentation">
                    <a class="nav-link" :class="navOption == 2 ? 'active' : ''" @click="navOption = 2;getRequest(t.id)" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Solicitudes</a>
                  </li>
                  <li class="nav-item" role="presentation">
                    <a class="nav-link" :class="navOption == 3 ? 'active' : ''" @click="navOption = 3;" data-toggle="pill" href="#pills-contact" role="tab" aria-controls="pills-contact" aria-selected="false">Editar</a>
                  </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                  <!-- Historial -->
                  <div class="tab-pane fade" :class="navOption == 1 ? 'show active' : ''" role="tabpanel" aria-labelledby="pills-home-tab">
                    <vacation-history v-if="navOption == 1 && t.id == idNav" :userId="t.id" :year="year" :origin="'Admin'"></vacation-history>
                  </div>
                  <!-- End historial -->
                  <!-- Solicitudes -->
                  <div class="tab-pane fade" :class="navOption == 2 ? 'show active' : ''" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <div class="card card-shadow">
                      <div class="card-body">
                        <div class="loading" v-show="loadingRequest">

                        </div>
                        <div v-show="!loadingRequest">
                          <div class="grid-buttons" >
                            <button v-for="(r, index) in request"  :key="r.id" type="button" @click="dataRequest = r;classBtnRequest = index;" class="btn btn-outline-info btn-w btn-pd fw" :class="classBtnRequest == index ? 'active' : ''">Solicitud {{index + 1}}</button>
                          </div>
                          <template v-if="dataRequest != null">
                            <hr class="hr">
                            <p class="p-admin pd-text" style="color: #6C757D !important;">Supervisor(a) :</p>
                            <p style="color: #000;" class="pd-text text-al text-f fw">
                              {{dataRequest.name}}
                            </p>
                            <hr class="hr">
                            <div class="grid-inputs-one-admin">
                              <div class="form-group text-al">
                                <label class="fw">Tipo de ausencia</label>
                                <select v-model="dataRequest.type" class="form-control">
                                  <option value="0">Selecciona una opción</option>
                                  <option value="1">Vacaciones</option>
                                  <option value="2">Vacaciones (medio turno)</option>
                                  <option value="3">Enfermedad</option>
                                  <option value="4">Otro</option>
                                </select>
                                <template v-if="dataRequest.type == 4">
                                  <input v-model="dataRequest.commentother" type="text" class="form-control" placeholder="Escriba un comentario" style="margin-top: 2%;">
                                </template>
                              </div>
                              <div class="form-group text-al">
                                <label class="fw">Días solicitados</label>
                                <input type="text" v-model="dataRequest.days" class="form-control">
                              </div>
                              <div class="form-group text-al">
                                <label class="fw">Rango de fechas</label>
                                <div class="grid-inputs-two">
                                  <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text" style="font-size:small;">Inicio:</span>
                                    </div>
                                    <input v-model="dataRequest.date_start" type="date" class="form-control" >
                                  </div>
                                  <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                      <span class="input-group-text" style="font-size:small;">Fin:</span>
                                    </div>
                                    <input v-model="dataRequest.date_end" type="date" class="form-control" >
                                  </div>
                                </div>
                              </div>

                            </div>
                            <div class="form-group text-al">
                              <label class="fw">Comentario compartido</label>
                              <textarea v-model="dataRequest.comment" class="form-control"
                              rows="3"></textarea>
                            </div>
               <div class="form-group text-al">
                              <label class="fw">Notas de supervisor(a)</label>
                              <textarea v-model="dataRequest.supervisor_note" class="form-control"
                              rows="3"></textarea>
                            </div>
                            <div class="grid-inputs-two m-lr" style="gap: 4%;" v-if="dataRequest.status == 1">
                              <button @click="requestHoliday(2)" type="button" class="btn btn-outline-success btn-rounded">
                                <img src="images/Solicitar.png">
                                Aprobar
                              </button>
                              <button @click="requestHoliday(3)" type="button" class="btn btn-outline-danger btn-rounded">
                                <img src="images/cancelar.png">
                                Rechazar
                              </button>
                            </div>
                            <div class="grid-inputs-two m-lr" style="gap: 4%;" v-else>
                              <template v-if="dataRequest.status == 2">
                                <button type="button" class="btn btn-outline-info">Aprobado</button>
                              </template>
                              <template v-if="dataRequest.status == 3">
                                <button type="button" class="btn btn-outline-danger">Rechazado</button>
                              </template>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>

                  </div>
                  <!-- End Solicitudes -->
                  <!-- Detalles -->
                  <div class="tab-pane fade" :class="navOption == 3 ? 'show active' : ''" role="tabpanel" aria-labelledby="pills-contact-tab">
                    <div class="card card-shadow">
                      <div class="card-body">
                        <div class="loading" v-show="loadingRequest">

                        </div>
                        <div v-show="!loadingRequest">
                        <div class="grid-buttons" >
                          <button type="button" class="btn btn-outline-info btn-w btn-pd fw" @click="year = 2022;" :class="year == 2022 ? 'active' : ''">{{year}}</button>
                          <!-- <button type="button" class="btn btn-outline-info btn-center btn-w btn-pd fw" @click="year = 2023;" :class="year == 2023 ? 'active' : ''">2023</button> -->
                          <!-- <button type="button" class="btn btn-outline-info btn-right btn-w btn-pd fw" @click="year = 2024;" :class="year == 2024 ? 'active' : ''">2024</button> -->
                        </div>
                        <div class="grid-dates">
                          <div class="card-days">
                            <span>&nbsp;</span>
                            <div>
                              <p class="m0 fw color-black">
                                <template v-for="(detail, index) in t.vacationabsencesdetail">
                                  <div v-if="detail.active == 1" :key="index">
                                    {{(parseFloat(detail.permanent_holidays) + parseFloat(detail.flexible_holidays)) + (parseFloat(detail.days_replacement ))}} días generados
                                  </div>
                                </template>
                              </p>
                              <p class="m0 fw">Desde: [Fecha inicial / fecha ingreso]</p>
                            </div>
                          </div>


                          <template v-for="(detail, index) in t.vacationabsencesdetail">
                            <div v-if="detail.active == 1" :key="'ph' + index">

                              <div class="card-days">
                                <div class="grid-buttons-up-down">
                                  <span class="icon square arrow up" @click="edit += 1; initialStatusVacationFi += 1; detail.permanent_holidays = parseFloat(detail.permanent_holidays) + 1; "></span>
                                  <span class="icon square arrow down" @click="edit += 1; initialStatusVacationFi -= 1; detail.permanent_holidays = parseFloat(detail.permanent_holidays) - 1; "></span>
                                </div>
                                <p class="m0 fw color-black">
                                  {{parseFloat(detail.permanent_holidays)}} vacaciones fijas
                                </p>
                              </div>

                            </div>
                          </template>


                          <template v-for="(detail, index) in t.vacationabsencesdetail">
                            <div v-if="detail.active == 1" :key="'fh' + index">
                              <div class="card-days">
                                <div class="grid-buttons-up-down">
                                  <span class="icon square arrow up"
                                    @click="edit += 1; initialStatusVacationFl += 1; initialStatusVacationDg += 1;
                                    detail.flexible_holidays = parseFloat(detail.flexible_holidays) + 1;
                                    detail.days_generated = parseFloat(detail.days_generated) + 1;">
                                  </span>
                                  <span class="icon square arrow down"
                                    @click="edit += 1; initialStatusVacationFl -= 1; initialStatusVacationDg -= 1;
                                    detail.flexible_holidays = parseFloat(detail.permanent_holidays) - 1;
                                    detail.days_generated = parseFloat(detail.days_generated) - 1;">
                                  </span>
                                </div>
                                <p class="m0 fw color-black">
                                  {{parseFloat(detail.flexible_holidays )}} vacaciones flexibles
                                </p>
                              </div>
                            </div>
                          </template>

                          <template v-for="(detail, index) in t.vacationabsencesdetail">
                            <div v-if="detail.active == 1" :key="index">
                              <div class="card-days-two">
                                <p class="m0 fw color-black">
                                  {{parseFloat(detail.days_replacement )}} días reposición
                                </p>
                                <div class="grid-buttons-plus">
                                  <div class="circle" @click="visible = true; typeDayAdd = 1;detailId = detail.id;">
                                    <span class="plus">+</span>
                                  </div>
                                  <label style="margin-left :2%;margin-right: 2%;">&nbsp;</label>
                                  <div class="circle" @click="visible = true; typeDayAdd = 2;detailId = detail.id;">
                                    <span class="plus">-</span>
                                  </div>
                                </div>
                                <div class="grid-buttons-plus">
                                  <table>
                                    <tr>
                                      <th>Días</th>
                                      <th>Notas</th>
                                    </tr>
                                    <tr v-for="vard in detail.vacationabsencesreplacementdays"  :key="vard.id">
                                      <td>{{(vard.type == 1 ? '+' : vard.type == 2 ? '-' : '')  + parseFloat(vard.days)}}</td>
                                      <td>{{vard.note}}</td>
                                    </tr>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </template>

                        </div>
                        <div class="text-footer">
                          <div>
                            <p class="mtb0 fw color-black" style="font-size: 1.2rem;">
                              <template v-for="(detail, index) in t.vacationabsencesdetail">
                                <div v-if="detail.active == 1" :key="index">
                                  {{parseFloat(detail.days_generated )}} días disponibles / usados
                                </div>
                              </template>
                            </p>
                            <p class="mtb0 fw">Válidos hasta el [31/03/23]</p>
                          </div>
                          <div class="grid-buttons-plus" v-show="edit > 0">

                            <button type="button" class="btn btn-outline-primary" style="height: 50%; align-self: center; margin-left: 2%;" name="button" @click="saveDaysUpdate(t.vacationabsencesdetail)">Guardar cambios</button>
                            <button type="button" class="btn btn-outline-danger" style="height: 50%; align-self: center; margin-left: 1%;"
                            @click="
                            t.vacationabsencesdetail[0].flexible_holidays =  t.vacationabsencesdetail[0].flexible_holidays - (initialStatusVacationFl);
                            t.vacationabsencesdetail[0].permanent_holidays =  t.vacationabsencesdetail[0].permanent_holidays - (initialStatusVacationFi);
                            t.vacationabsencesdetail[0].days_generated =  t.vacationabsencesdetail[0].days_generated - (initialStatusVacationDg);
                            initialStatusVacationFl = 0;
                            initialStatusVacationFi = 0;
                            initialStatusVacationDg = 0;
                            edit = 0;" name="button">
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                <!-- End detalles -->
              </div>
            </td>
          </template><!--End of filter-->
        </template>
      </tr>
      <!-- End child -->
    </template>
  </tbody>
</table>
</div>
<a-modal v-model="visible" :title="typeDayAdd == 1 ? 'Agregar días': typeDayAdd == 2 ? 'Restar días' : ''" @ok="handleOk">
  <div v-if="!loading">
    <label>Días</label>
    <input type="number" class="form-control" v-model="daysr">
    <label>Nota</label>
    <input type="text" class="form-control" v-model="noter">
  </div>
  <div class="loading" v-show="loading">
  </div>
  </a-modal>
</div>

</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VacationHistory from "@/views/vacation/VacationHistory.vue";
import {Modal} from "ant-design-vue";
import axios from "axios";

@Component({
  components: {VacationHistory }
})

export default class Welcome extends Vue {
  userName = "";
  check = "";

  checkboxOrgCm = true;
  checkboxOrgCu = false;
  checkboxOrgFi = false;
  checkboxOrgSu = false;

  data: Array<any> = [];
  history: any = [];
  request: Array<any> = [];
  dataRequest: any = null;

  year = 2022;
  yeatHistory = 2022;

  navOption = 1;
  idNav = 0;
  classBtnRequest: any = -1;

  edit = 0;

  initialStatusVacationFi = 0;
  initialStatusVacationFl = 0;
  initialStatusVacationDg = 0;

  visible = false;
  loadingRequest = false;
  loading = false;

  typeDayAdd = 0;//1 suma, 2 resta
  detailId = 0;
  daysr = 0;
  noter = '';

  async handleOk() {
    this.loading = true;
    const result: any = await axios.post('/api/save-detail-holiday',
    { id : this.detailId,
      type : this.typeDayAdd,
      day : this.daysr,
      note : this.noter
    });
    if (result.status) {
        this.getUsersActive();
        this.visible = false;
        this.daysr = 0;
        this.noter = '';
        this.loading = false;
    }
  }

  async getRequest(id: any) {
    const request = await axios.get('/api/user-request-vacation/' + id + '&' + this.year);
    this.request = request.data;
  }

  async getHistory(id: any) {
    const history = await axios.get('/api/user-history-vacation/' + id + '&' + this.yeatHistory);
    this.history = history.data;
  }

  async getUsersActive(){
    const response = await axios.get('/api/get-list-users-active');
    this.data = response.data;
  }

  async requestHoliday(status: any) {
    this.loadingRequest = true;
    const result: any = await axios.post('/api/admin-request-holiday',
    { id : this.dataRequest.id,
      supervisorNote : this.dataRequest.supervisor_note,
      status : status
    });
    if (result.data) {
      this.dataRequest = result.data.data;
      this.loadingRequest = false;
    }
    const success = Modal.success;
    success({
      title:  status == 2 ? 'Aprobado' : status == 3 ? 'Rechazado' : '',
      content: '',
      okText: 'Aceptar',
    });
  }

  async saveDaysUpdate(data: any){
    this.loadingRequest = true;
    const result: any = await axios.post('/api/save-days-update', data[0]);
    if (result.data) {
      this.loadingRequest = false;
    }
    const success = Modal.success;
    success({
      title:  'información actualizada',
      content: '',
      okText: 'Aceptar',
    });
  }

  async mounted() {
    this.userName = this.$store.state.user.name;
    this.check = this.$store.state.user.pronombre;
    this.getUsersActive();
  }
}
</script>
<style media="screen">

.custom-h5{
  font-size: 2em !important;
  font-family: IBM Plex Sans Condensed;
  color: #50504f;
  font-weight: 600;
}

.fh {
  font-size: 0.9em;
}

.table-info-new {
  background: #f4f7f9;
}

.grid-inputs-one-admin {
  display: grid;
  grid-template-columns: 25% 25% 50%;
  gap : 5px;
}
</style>
<style media="screen">
.list-org {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grid-check {
  display: grid;
  grid-template-columns: 80% 20%;
}

.container-check {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  /* font-size: 22px; */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* Hide the browser's default checkbox */
.container-check input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

/* Create a custom checkbox */
.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container-check:hover input ~ .checkmark {
  background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container-check input:checked ~ .checkmark {
  background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Show the checkmark when checked */
.container-check input:checked ~ .checkmark:after {
  display: block;
}

/* Style the checkmark/indicator */
.container-check .checkmark:after {
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 1px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.grid-dates {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5%;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  margin-top: 1%;
}

.card-days {
  text-align: left;
  display: grid;
  grid-template-columns: 10% 90%;
  height: min-content;
  border-top: 4px solid #6236ff;
  margin-top: 4%;
}

.card-days-two {
  border-top: 4px solid #6236ff;
  margin-top: 4%;
  text-align: left;
  display: grid;
  grid-template-columns: 78% 15%;
  height: min-content;
}

.text-footer {
  display: flex;
  justify-content: flex-end;
}

.m0 {
  margin-bottom: 0;
  margin-top: 2%;
  font-size: 1em;
}

.mtb0 {
  margin-bottom: 0;
  margin-top: 0;
}

.color-black {
  color: #000000;
}

span.square{
  background: transparent;
  border-radius:5px;
  border-bottom:1px solid #FFF;
  display:inline-block;
  height:10px;
  width:10px;
  cursor: pointer;
}
.arrow{
  position:relative;
}
.arrow.up:after{
  position:absolute;
  top:7px;
  left:7px;
  width: 0;
  height: 0;
  content:'';
  border-style: solid;
  border-width: 0 7px 8px 7px;
  border-color: transparent transparent #000000 transparent;
  border-radius:2px;
}

.arrow.up:before{
  position:absolute;
  top:11px;
  left:7px;
  width: 0;
  height: 0;
  content:'';
  border-style: solid;
  border-width: 0 7px 8px 7px;
  border-color: transparent transparent transparent transparent;
  border-radius:2px;
}

.arrow.down:after{
  position:absolute;
  top:10px;
  left:7px;
  width: 0;
  height: 0;
  content:'';
  border-style: solid;
  border-width: 8px 7px 0 7px;
  border-color: #000000 transparent transparent transparent;
  border-radius:2px;
}

.arrow.down:before{
  position:absolute;
  top:12px;
  left:7px;
  width: 0;
  height: 0;
  content:'';
  border-style: solid;
  border-width: 8px 7px 0 7px;
  border-color: transparent transparent transparent transparent;
  border-radius:2px;
}

.grid-buttons-up-down {
  display: flex;
  flex-direction: column;
}

.grid-buttons-plus {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.btn-plus {
  border-radius: 80%;
  height: 80%;
  border: 1px solid black;
  background: transparent;
  padding: 0;
  padding-left: 12%;
  padding-right: 12%;
  padding-bottom: 2%;
  padding-top: 2%;
  margin-left: 4%;
  font-size: 4rem;
}

.circle{
  width: 60%;
  height: 60%;
  border: 1px solid #000;
  border-radius: 100%;
  -moz-border-radius: 100%;
  -webkit-border-radius: 100%;
  text-align: center;
  font: small-caption;
  font-weight: bold;
  cursor: pointer;
}

</style>
