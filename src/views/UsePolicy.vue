<template>
    <div class="container-home">
      <div class="row">
          <div class="col-lg-12 col-md-12">
              <div class="card">
                <h1 class="title-home">Política de uso de TimeWorks</h1>
                <div class="card-body card-shadow" >
                  <p class="paragraphs">
                    TimeWorks es una herramienta para la gestión del tiempo dedicado por el personal (tiempo completo o parcial) de C230 Consultores y Fundación IDEA en actividades relacionadas al cumplimiento de sus responsabilidades como parte de dichas organizaciones.
                  </p>
                  <p class="paragraphs">
                    Para el uso de TimeWorks es imprescindible que el personal cumpla con la "Política de Registro de Tiempos”, la cual se encuentra disponible también en la Plataforma de Gestión del Conocimiento (http://pgc.c-230.com/), así como otras directrices internas administrativas y, de ser el caso, de proyectos específicos.
                  </p>
                  <p class="paragraphs">
                    TimeWorks facilita la consolidación de los registros de tiempos realizados por el personal en sus Google Calendar vinculados a sus cuentas oficiales de las organizaciones. Para los registros de tiempos, el personal tendrá como referencia el "Catálogo de Códigos", el cual incluye códigos para todo tipo de actividades (proyectos, actividades generales, días inhábiles, entre otros).
                  </p>
                  <p class="paragraphs">
                    Para mayor información sobre las características funcionales de TimeWorks, referirse al “Manual de Uso de TimeWorks”, el cual se encuentra también disponible en la Plataforma de Gestión del Conocimiento.
                  </p>
                  <div class="custom-control form-control-lg custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="exampleCheck1" v-model="check" v-on:change="checkClick()">
                    <label class="custom-control-label" for="exampleCheck1">He leído la Política de uso de TimeWorks y acepto las consideraciones ahí contenidas</label>
                  </div>
                </div>
              </div>
          </div>
      </div>
      <div class="row justify-content-center mt-4">
        <div class="col-md-3 col-lg-6 col-xl-3">
          <a href="/pdf/politica_registro.pdf" target="_blank"  class="btn btn-block btn-outline-primary mb-2"  style="white-space: normal;">
            Política de Registro de Tiempos
          </a>
        </div>
        <div class="col-md-3 col-lg-6 col-xl-3">
          <a href=" https://docs.google.com/spreadsheets/d/1JVyopkCjXnaiFEgrb1T7Y6cnyrFC5NqY06X-2-012Mc/edit?usp=sharing" target="_blank"  class="btn btn-block btn-outline-primary mb-2" style="white-space: normal;">
            Catálogo de Códigos
          </a>
        </div>
        <div class="col-md-3 col-lg-6 col-xl-3">
          <a href="/pdf/Manual de uso TimeWorks- Junio 2021.pdf" target="_blank"  class="btn btn-block btn-outline-primary mb-2" style="white-space: normal;">
            Manual de Uso de TimeWorks
          </a>
        </div>
      </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class UsePolicy extends Vue {
    check = false;
    mounted(){
      this.check = this.$store.state.agreedToPrivacy;
    }
    checkClick(){
      this.$store.commit('ACCEPT_PRIVACY', this.check);
    }
}
</script>
<style scoped>

</style>
