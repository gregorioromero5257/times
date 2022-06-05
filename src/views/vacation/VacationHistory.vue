<template>

  <div class="card card-shadow height-card" >
    <div class="card-body" >
      <div class="loading" v-show="history.length == 0">
      </div>
      <div v-show="loading.length != 0">
        <template v-if="origin == 'user'">
          <div class="grid-inputs-one">
            <p class="text-al fw" style="color: #310981;">Mi historial</p>
            <div class="grid-buttons">
              <button type="button" class="btn btn-outline-info btn-left btn-w btn-pd fw" @click="year = 2022;" :class="year == 2022 ? 'active' : ''">2022</button>
              <button type="button" class="btn btn-outline-info btn-center btn-w btn-pd fw" @click="year = 2023;" :class="year == 2023 ? 'active' : ''">2023</button>
              <button type="button" class="btn btn-outline-info btn-right btn-w btn-pd fw" @click="year = 2024;" :class="year == 2024 ? 'active' : ''">2024</button>
            </div>
          </div>
        </template>
        <template v-if="origin == 'Admin'">
          <div class="grid-buttons" >
            <button type="button" class="btn btn-outline-info btn-left btn-w btn-pd fw" @click="year = 2022;" :class="year == 2022 ? 'active' : ''">2022</button>
            <button type="button" class="btn btn-outline-info btn-center btn-w btn-pd fw" @click="year = 2023;" :class="year == 2023 ? 'active' : ''">2023</button>
            <button type="button" class="btn btn-outline-info btn-right btn-w btn-pd fw" @click="year = 2024;" :class="year == 2024 ? 'active' : ''">2024</button>
          </div>
          <br>
        </template>
        <div class="table-responsive">

          <table class="table">
            <thead>
              <tr class="table-info-new">
                <th scope="col" style="color: #3d70b3;">Tipo de ausencia </th>
                <th scope="col" style="color: #3d70b3;">Fecha </th>
                <th scope="col" style="color: #3d70b3;">Estatus</th>
              </tr>
            </thead>
            <tbody>
              <tr class="text-al border-n" v-for="t in history"  :key="t.id">
                <td class="fw">{{t.type == 1 ? 'Vacaciones' : t.type == 2 ? 'Vacaciones (medio turno)' : t.type == 3 ? 'Enfermedad' : t.type == 4 ? 'Otro - ' + t.comment : ''}}</td>
                <td class="fw">{{t.fecha}}</td>
                <td>
                  <span :class="t.status == 1 ? 'span-revision' : t.status == 2 ? 'span-aprobado' : t.status == 3 ? 'span-rechazado' : t.status == 4 ? 'span-finalizado':''">
                  {{t.status == 1 ? 'En revisión' : t.status == 2 ? 'Aprobada' : t.status == 3 ? 'Rechazada' : t.status == 4 ? 'Finalizado' : ''}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>


</template>
<script lang="ts">
import { Component, Prop ,Vue } from 'vue-property-decorator';
import axios from "axios";

@Component

export default class Welcome extends Vue {
  @Prop({ default: 0 })
  private userId!: number;
  @Prop({ default: 0 })
  private year!: number;
  @Prop({ default: '' })
  private origin!: string;

  userName = "";
  check = "";
  loading = false;

  history: any = [];

  async getHistory() {
    const history = await axios.get('/api/user-history-vacation/' + this.userId + '&' + this.year);
    this.history = history.data;
  }

  async mounted() {
    this.userName = this.$store.state.user.name;
    this.check = this.$store.state.user.pronombre;
    this.getHistory();
  }
}
</script>
<style media="screen">
.img-w {
  background-image: url("/assets/images/Image.png");
  height: 80vh;
  background-repeat: no-repeat;
  background-position: center top;
  padding-bottom: 10%;
}

.custom-h5{
  font-size: 2em !important;
  font-family: IBM Plex Sans Condensed;
  color: #50504f;
  font-weight: 600;
}

.btn-outline-info {
  border-color: #3d70b2;
  color: #3d70b2;
}

.btn-outline-info.active {
  background: #3d70b2 !important;
  border-color: #3d70b2;
}

.btn-outline-info:hover {
  background: #3d70b2 !important;
  border-color: #3d70b2;
}

.table-info-new {
  background: #f4f7f9;
}
</style>
