import vue from '@vitejs/plugin-vue'
import createSvgIcons from './svg--icon.js'

/**
 * 创建 Vite 插件列表
 *
 * 集中管理项目运行（dev/build）所需的所有 Vite 插件，
 * 便于按环境变量或构建模式动态加载插件。
 *
 * @param {object}  viteEnv - 环境变量对象（通常由 loadEnv 解析得到，如 VITE_* 配置项）
 * @param {boolean} isBuild - 是否为生产构建模式，默认 false（开发模式）
 * @returns {Array} 配置好的 Vite 插件数组
 */
export default function createPlugins(viteEnv, isBuild = false) {
  // 初始化插件列表，默认引入 Vue 单文件组件（SFC）编译支持插件
  const vitePlugins = [vue()]
  // TODO: 此处为空 push，可在此按需动态添加其他插件，
  //      例如 vitePlugins.push(legacy()) 或根据 isBuild/viteEnv 条件加载
  vitePlugins.push(createSvgIcons())
  // 返回最终插件列表，交由 Vite 配置使用
  return vitePlugins
}