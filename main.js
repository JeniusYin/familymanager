import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import {myRequest} from './util/api.js'
import db from './util/wxdb.js'
import jsCommon from 'util/common.js'

Vue.prototype.$myRequest = myRequest
Vue.prototype.$db = db
Vue.prototype.jsCommon = jsCommon
Vue.use(uView)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
