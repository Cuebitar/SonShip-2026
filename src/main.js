import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import './assets/main.css'
import { createHead } from '@unhead/vue/client'
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebaseInit';
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
const head = createHead()
app.use(head)
app.use(VueFire, {
  firebaseApp,
  // Add modules if using Options API (Composition API doesn't need them here)
  // modules: [VueFireFirestoreOptionsAPI()], 
});
app.mount('#app')
