import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import axios from 'axios'
import moment from 'moment'

Vue.use(Vuetify, {
  iconfont: 'mdi'
});
Vue.config.productionTip = false;
Vue.prototype.moment = moment;

axios.interceptors.request.use(
    (config) => {
      // console.log(config);
      let token = localStorage.getItem('cpdm_token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
