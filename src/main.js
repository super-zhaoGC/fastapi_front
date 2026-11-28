import { createApp } from 'vue'
//引入路由守卫（内部只在守卫回调里取 store，因此可以安全地提前 import）
import '@/views/permission.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//导入ElementPlus的中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import App from './App.vue'
import router from './router'
import './assets/styles/index.css'
// 只保留这一个 Pinia 实例（stores/index.js 中 createPinia 出来的那个）
import store from './stores/index.js'
//引入自定义图标组件
import SvgIcon from '@/components/SvgIcon'
// 注册 SVG 雪碧图：vite-plugin-svg-icons 通过这个虚拟模块把 src/assets/icons/svg 下的
// 所有图标编译成 <symbol id="icon-xxx"> 注入到 body，SvgIcon 组件里的 <use href="#icon-xxx"> 才能取到图形。
// 少了这一行，<use> 引用的是不存在的 id，图标就是空白（不报错，只是看不见）。
import 'virtual:svg-icons-register'

//引入VxeUIBase组件库
import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'



const app = createApp(App)

// 先安装 Pinia，再安装路由：保证路由首次导航时守卫里能取到已激活的 store
app.use(store)
app.use(router)
app.use(ElementPlus)

//注册自定义图标组件
app.component('svg-icon', SvgIcon)
//注册VxeUIBase组件库
app.use(VxeUIBase)

//遍历ElementPlus的所有图标, 并且全部注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus, {
  //本地化配置: 设置为中文
  locale: zhCn,
})

app.mount('#app')