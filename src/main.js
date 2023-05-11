import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import appController from '@/js/app/controller.js'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


const app = createApp(App);

app.use(store);
app.use(router);
app.use(appController);

app.mount('#app');