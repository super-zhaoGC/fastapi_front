<template>
  <div class="">
    <!-- 顶部导航栏 -->
    <el-header
      style="background-color: #fff;height:50px;display:flex;position:fixed;top:0;left:0;right:0; box-shadow: 0 1px 4px rgba(0,23,45,0.08)">
      <div style="display:flex;align-items: center;">
        <img :src="logo" alt="logo" style="height: 40px;width: 40px;margin-left: 12px;">
        <span style="font-size: 28px;font-weight: bold;">管理系统</span>
      </div>
      <div style="flex: 1;display: flex;margin-left: 20px;">
        <el-breadcrumb separator="/" style="align-items: center;flex: 1;display: flex;">
          <el-breadcrumb-item v-for="(item, index) in breadItems" :key="index">
            <span>{{ item.meta.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>

        <div style="display: flex;align-items: center;">
          <span>欢迎，{{ userStore.name }}</span>
          <el-button type="text" @click="logout" style="display: flex; padding: 0 20px">
            <svg-icon icon-class="退出登录" />
            <span>退出登录</span>
          </el-button>
        </div>

        <el-dropdown trigger="click" style="cursor: pointer">
          <div style="display: flex;align-items: center;">
            <img :src="userStore.avatar" alt="" style="width: 28px; height: 28px">
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <router-link to="/user/profile">
                <el-dropdown-item>个人中心</el-dropdown-item>
              </router-link>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主布局区域 -->
    <main style="margin-left: 240px; position: relative; top: 50px">
      <AppMain />
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from "vue"
import logo from "@/assets/images/logo.png"
import { useRoute } from "vue-router"
import useUserStore from "@/stores/modules/userStore";
import { ElMessageBox } from "element-plus";
import AppMain from "@/views/layout/components/AppMain.vue";


const route = useRoute()
const breadItems = ref([])
const isDashboard = (route) => {
  const name = - route && route.name
  if (!name) {
    return false
  }
  return name.trim() === "index"
}

const getBread = () => {
  const matched = route.matched.filter(item => {
    item.meta && item.meta.title
  })
  if (!isDashboard(matched[0])) {
    matched.unshift({
      path: "/index",
      meta: {
        title: "首页"
      }
    })
  }
  breadItems.value = matched
}

onMounted(() => {
  getBread()
})

watchEffect(() => route.path, () => {
  getBread()
})


const userStore = useUserStore()

const logout = () => {
  ElMessageBox.confirm("确定退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    userStore.logout().then(() => {
      location.href = "/login"
    })
  })
}

</script>

<style scoped></style>