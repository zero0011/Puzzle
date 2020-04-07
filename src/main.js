import Vue from 'vue'
import App from './App'
import _ from 'loadsh'

Vue.config.productionTip = false
Vue.prototype._ = _

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
