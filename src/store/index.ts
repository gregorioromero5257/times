import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import Proxy from "../helpers/proxy";

declare const gapi: any;
axios.defaults.url = Proxy.api.domain;

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        user: null,
        auth: false,
        controlMenu: false,
        data : [],
        agreedToPrivacy: false
    },
    mutations: {
        SET_USER(state, user){
            state.user = user
            state.auth = Boolean(user);
        },
        BUTTON_DISPLAY(state){
            state.controlMenu = true;
        },
        SET_DATA(state, data){
            state.data = data
        },
        INITIAL_STORE(state) {
            if (localStorage.getItem('agreedToPrivacy')) {
                state.agreedToPrivacy =  (localStorage.getItem('agreedToPrivacy') == "true");
            }
        },
        ACCEPT_PRIVACY(state, value) {
            localStorage.setItem('agreedToPrivacy', value);
            state.agreedToPrivacy = value;
        }
    },
    actions: {
        async logout({dispatch}){
            await axios.post('/api/logout');
            localStorage.removeItem('acess_token');
            localStorage.removeItem('use_policy_check');
            return dispatch('getUser');
        },
        async login ( {dispatch}, credentials){
            console.log('credentials')
            const  access = await axios.post('/api/login',credentials);
            if(access.data.token){
                localStorage.setItem(
                    'acess_token',access.data.token
                )
            }else{
                console.error('login access error');
            }
            return dispatch('getUser');
        },
        async getUser({commit}){
            try {
                const res  = await axios.get('/api/user');
                commit('SET_USER',res.data);
            } catch (error) {
                commit('SET_USER',null)
            }
        },
        displayButton({commit}){
            commit('BUTTON_DISPLAY');
        }
    },
    modules: {
    }
})
