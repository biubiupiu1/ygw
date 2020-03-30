import Vue from './lib/element';
import App from './App.vue';
import router from './router';
import store from './store';
import { instance } from './http/index';

import './components/index';

Vue.prototype.$http = instance;
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');
