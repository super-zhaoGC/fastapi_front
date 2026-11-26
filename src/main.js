import { createApp } from 'vue'
import { createPinia } from 'pinia'
//引入路由守卫
import '@/views/permission.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//导入ElementPlus的中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import './assets/css/index.css'
import store from './stores/index.js'



const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)

//遍历ElementPlus的所有图标, 并且全部注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  //本地化配置: 设置为中文
  locale: zhCn,
})

app.mount('#app')