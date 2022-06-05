

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-1 col-md-1"></div>
            <div class="col-lg-10 col-md-10">
                <table class="table table-responsive">
                    <thead style="background: #f4f7f9">
                       <th style="font-weight: bold;">#</th>
                        <th style="font-weight: bold;">Colaborador</th>
                        <th style="font-weight: bold;">Cargo</th>
                        <th style="font-weight: bold;">Codigo y nombre del proyecto</th>
                        <th style="font-weight: bold;">Descripción</th>
                        <th style="font-weight: bold;">Tiempo destinado</th>
                    </thead>
                    <tbody>
                        <tr v-for="(query, index) in projectsReport" :key='index'>
                            <td>{{ index + 1}}</td>
                            <td>{{query.user.name}}</td>
                            <td>{{query.user.position.name}}</td>
                            <td>{{query.project.name}}</td>
                            <td>{{query.description}}</td>
                            <td>{{query.hours}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-lg-1 col-md-1"></div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from 'axios';

@Component
export default class ReportsByProject extends Vue {
    projectsReport: Array<any>=[];
    created() {
        this.generalReports();
    }
     async generalReports(){
      const  query = await axios.get('/api/projecttimeworkuser');
      this.projectsReport = query.data;
    }
}
</script>
