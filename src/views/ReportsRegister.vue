<template>
  <div class="row">
    <div class="col-md-7">
      <h6 class="text-muted">Seleccione un colaborador y un año</h6>
      <div class="row">
        <div class="col-md-6">
          <a-select  default-value="Selecciona un colaborador" style="width: 100%" @change="userChange"  placeholder="Selecciona un proyecto">
            <a-select-option  v-for="(user, index) in users" :key='index'>
              {{ user.name }}
            </a-select-option>
            template
          </a-select>
        </div>
        <div class="col-md-6">
          <a-select  :default-value="yearNow" @change="yearChange"  style="width: 100%">
            <a-select-option  v-for="(year, index) in yearRange" :key='index'>
              {{ year }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="row mt-4 text-center">
        <table class="table table-bordered table-responsive">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Archivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id">
               <td v-text="getMonthName(item.month_number)"></td>
               <td>
                 <a target="_blank" v-if="item.path" :href="item.path">
                 <img src="/images/icons8-pdf-40.png" alt="" style="width: 28px; cursor: pointer">
                 </a>
               </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import axios from "axios";
@Component
export default class ReportsRegister extends Vue {
  private yearNow = new Date().getFullYear();
  private yearRange: Array<number> = [];
  private users: any = [];
  private user: any = null;
  private data: any = [];

  async mounted(){
    for (let _i = this.yearNow - 5; _i <= this.yearNow; _i++) {
      this.yearRange.unshift(_i);
    }
    const response = await axios.post('/api/user-list');
    this.users = response.data;
  }

  private yearChange(index: any){
    this.yearNow = this.yearRange[index];
    this.getReportsUploaded();
  }

  private userChange(index: any){
    this.user =  (typeof index === 'number') ? this.users[index] : null;
    this.getReportsUploaded();
  }

  async getReportsUploaded(){
    if (this.user == null)return;
    console.log(this.user)
    try {
      const response = await axios.post('/api/files-reporters', { year: this.yearNow, userId : this.user.id });
      this.data = response.data;
    }
    catch (e) {
      console.log(e);
    }
  }

   getMonthName(month: any){
     const months: { [id: number]: string } = {
       1 : "Enero",
       2 : "Febrero",
       3 : "Marzo",
       4 : "Abril",
       5 : "Mayo",
       6 : "Junio",
       7 : "Julio",
       8 : "Agosto",
       9 : "Septiembre",
       10 : "Octubre",
       11 : "Noviembre",
       12 : "Diciembre",
     };
     return months[Number(month)];
   }

}
</script>

<style scoped>

</style>
