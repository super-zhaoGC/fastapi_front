// vite-plugin-svg-icons：将 SVG 图标批量编译为雪碧图（SVG Sprite），供全局 <symbol> 引用
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"

// node 内置 path 模块，用于拼接图标目录的绝对路径
import path from 'path'

/**
 * 创建 SVG 图标插件
 * 扫描指定目录下的所有 .svg 文件，自动生成 SVG Sprite，
 * 通过 symbol 的 id（如 <use href="#icon-name">）在页面中按需使用图标
 */
export default function createSvgIcons() {
  return createSvgIconsPlugin({
    // 图标目录：项目根目录下的 src/assets/icons/svg，收集该目录中所有 svg 文件
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
    // symbol 的 id 格式：icon-[上级目录名]-[文件名]，如 src/assets/icons/svg/home.svg -> #icon-home
    symbolId: 'icon-[dir]-[name]'
  })
}