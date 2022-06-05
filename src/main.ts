import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import Highcharts3D from 'highcharts/highcharts-3d'
import { DatePicker, Select, Modal, ConfigProvider} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import exportingInit from 'highcharts/modules/exporting';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import VModal from 'vue-js-modal'

exportingInit(Highcharts);
Vue.use(HighchartsVue);
Vue.use(DatePicker);
Vue.use(Modal);
Vue.use(Select);
Vue.use(ConfigProvider);
Vue.use(VueSweetalert2);
Vue.use(VModal)

Highcharts3D(Highcharts);
Vue.config.productionTip = false

axios.interceptors.request.use(function(config) {
  config.headers.common = {
    Authorization: `Bearer ${localStorage.getItem("acess_token")}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };
  return config;
});


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
