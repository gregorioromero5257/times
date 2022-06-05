import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/login/Login.vue'
import store from '@/store';  //or use a full path to ./store
import UsePolicy from '@/views/UsePolicy.vue'
import QueryUser from "@/views/QueryUser.vue";
import QueryUserChart from "@/views/QueryUserChart.vue";
import MonthlyReportUser from "@/views/MonthlyReportUser.vue";
import GeneralRegisters from "@/views/GeneralRegisters.vue";
import Administration from "@/views/Administration.vue";
import ReportsGeneration from "@/views/ReportsGeneration.vue";
import Welcome from "@/views/Welcome.vue";
import Vacation from "@/views/Vacation.vue";

Vue.use(VueRouter)
const routes: Array<RouteConfig> = [
  {
    path: '*',
    redirect:'/login'
  },
  {
    path:'/use-policy',
    name: 'UsePolicy',
    component: UsePolicy,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/home',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/query-user',
    name: 'QueryUser',
    component: QueryUser,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/query-user-chart',
    name: 'QueryUserChart',
    component: QueryUserChart,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/monthly-report-user',
    name: 'MonthlyReportUser',
    component: MonthlyReportUser,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/administration',
    name: 'Administration',
    component: Administration,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/reports-generation',
    name: 'ReportsGeneration',
    component: ReportsGeneration,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/login',
    name:'Login',
    component: Login
  },
  {
    path:'/welcome',
    name: 'Welcome',
    component: Welcome,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
  {
    path:'/vacation',
    name: 'Vacation',
    component: Vacation,
    beforeEnter: (to, from, next) => {
      store.dispatch("getUser").then(() => {
        const user = store.state.auth;
        if (user) {
          next();
        } else {
          next('/login');
        }
      });
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
