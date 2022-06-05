<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <div class="container" style="height: 100% !important; width: 100%!important;" v-if="isLogin">
        <router-view/>
      </div>
      <div v-if="!isLogin">
        <!-- <div class="wrapper" style="border: 1px solid pink;"> -->
          <div class="grid-container-home">
            <div class="item-nav-bar">
              <nav-bar></nav-bar>
            </div>
            <div class="grid-content">
              <div class="item-side-bar">


                <side-bar></side-bar>

              </div>
              <div class="item-content">




                  <router-view/>
              </div>
            </div>
            <div class="item-footer">
              <label>&nbsp;</label>
            </div>
          </div>
        <!-- </div> -->

        <!-- <div class="wrapper" style="border: 1px solid pink;">
        <nav id="sidebar"  style="border: 1px solid green;">
        <div class="sidebar-header">
        <h4 class="custom-h5">¡Bienvenido(a)  a TimeWorks, {{ userName }} !</h4>
        <router-link to="/use-policy">
        <button type="button" class="btn btn-block btn-outline-light">Política de uso</button>
      </router-link>
    </div>
    <side-bar></side-bar>
  </nav>
  <div id="content" style="border: 1px solid blue;">
  <nav-bar style="border: 1px solid red;"></nav-bar>
  <banner></banner>
  <div class="container">
  <back-to-top bottom="25px" right="50px">
  <img src="/images/volver_arriba.png" alt="">
</back-to-top>
<router-view/>
</div>
</div>


</div> -->
</div>

</div>
</a-config-provider>

</template>
<script lang="ts">
import locale from 'ant-design-vue/es/locale/es_ES';
import { Component, Vue } from 'vue-property-decorator';
import SideBar from './components/SideBar.vue';
import SideBarDecorator from './components/SideBarDecorator.vue';
import NavBar from "@/components/NavBar.vue";
import Banner from "@/components/Banner.vue";
import BackToTop from 'vue-backtotop'

@Component({
  components: {
    Banner,
    NavBar,
    SideBar,
    SideBarDecorator,
    BackToTop
  }
})
export default class App extends Vue {

  config = {
    size : 30,
    bottom: 50,
    src :  "/images/volver_arriba.png",
    bgColor : "transparent",
  };

  userName = "";
  // goToUsePolicy(){
  //     this['$router'].replace("/use-policy");
  // }

  // async logout(){
  //   await this['$store'].dispatch('logout');
  //   this['$router'].replace("/login");
  // }

  async mounted() {
    this['$store'].dispatch("getUser").then(() => {
      this.userName = this['$store'].state.user.name.replace(/ .*/,'');
    });
  }

  locale = locale;

  created() {
    console.log(locale);
  }


  get isLogin(){
    const path = this['$route'].fullPath;
    if(path === '/login') return true;
    else return false;
  }

  beforeCreate() {
    this.$store.commit('INITIAL_STORE');
  }

}
</script>

<style>
.title-home{
  font-family: IBM Plex Sans Condensed;
  font-size: 2em;
  color: #6C757D;
  text-align: left;
  vertical-align: top;
  font-weight: 700;
  text-transform: none;
}
.card-shadow{
  background-color: #FFFFFE;
  box-shadow: 0 0 30px  #00000040;;
  border-radius: 8px;
}

.new{
color: #000000;
}

.paragraphs{
  font-family: IBM Plex Sans Condensed;
  font-size: 1.2em;
  color: #50504f;
  text-align: left;
  vertical-align: middle;
  font-weight: 600;
  text-transform: none;
}

.actions-button{
  border-color: #3FD5A8;
  font-family: IBM Plex Sans Condensed;
  font-size: 1.1em;
  border-width: 2px;
  width: 225px;
  height: 37px;
  font-weight: 600;
  border-radius: 9px;
}

.card{
  border: 0px !important;
}

.custom-h5{
  font-size: 1.6em !important;
}

#myBtn {
  display: none; /* Hidden by default */
  position: fixed; /* Fixed/sticky position */
  bottom: 20px; /* Place the button at the bottom of the page */
  right: 30px; /* Place the button 30px from the right */
  z-index: 99; /* Make sure it does not overlap */
  border: none; /* Remove borders */
  outline: none; /* Remove outline */
  background-color: red; /* Set a background color */
  color: white; /* Text color */
  cursor: pointer; /* Add a mouse pointer on hover */
  padding: 15px; /* Some padding */
  border-radius: 10px; /* Rounded corners */
  font-size: 18px; /* Increase font size */
}

#myBtn:hover {
  background-color: #555; /* Add a dark-grey background on hover */
}

.grid-container-home {
  display: grid;
  grid-template-columns: 1fr;
  /* grid-auto-rows: 8% 88% 4%; */
  background-color: #FFFFFF;
  max-width: 1000vh;
  /* min-height: 145vh; */
}

.grid-container-home > div {
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.grid-content {
  display: grid;
  grid-template-columns: 9% 91%;
  height: 100%;
}

.item-nav-bar {
  background: rgb(19,5,108);
  background: linear-gradient(102deg, rgba(19,5,108,1) 0%, rgba(102,33,166,1) 62%);
  text-align-last: left;
}

.item-side-bar {
  background: #f2f4f8;
}

.item-footer {
  background: #4d5358 !important;
}

.item-side-bar {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.font-button {
  font-size: 0.7em;
  font-weight: 600;
}

.item-content {
  min-height: 85vh;
}

@media (min-width: 1025px) and (max-width: 1200px) {
  .grid-content {
    grid-template-columns: 10% 90%;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid-content {
    grid-template-columns: 12% 88%;
  }
}

@media (max-width: 768px) {
  .grid-content {
    grid-template-columns: 1fr;
  }

  .item-side-bar {
    display: none;
  }

  .item-nav-bar {
    padding-bottom: 1%;
  }
}

</style>
