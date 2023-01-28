import Vue from 'vue'
import AppComponent from './App/App.vue'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(elementui)

Vue.config.productionTip = false

Vue.component('app-component', AppComponent)

new Vue({
    el: '#app',
    render: (createElement) => {
        return createElement(AppComponent)
    }
})
