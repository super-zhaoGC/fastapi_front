<template>
  <!-- 个人中心页面：居中布局，最大宽度 500px，用于展示头像、基本信息及相关操作 -->
  <div style="text-align: center;margin: 20px auto;max-width: 500px;">
    <!-- 头像上传区域 -->
    <div>
      <!-- 点击头像触发上传，上传成功后展示新头像 -->
      <el-upload class="avatar-uploader" :action="uploadUrl" :headers="headers" :show-file-list="false"
        :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :before-upload="beforeUpload">
        <img :src="userStore.avatar" class="avatar" alt="" />
      </el-upload>

    </div>
    <!-- 用户基础信息展示列表 -->
    <ul class="list-group" style="display: inline-block; text-align: left; width: 100%;max-width: 300px">
      <li class="list-group-item">
        用户名称
        <!-- 展示当前登录用户的名称（来自用户状态管理） -->
        <div class="pull-right">{{ userStore.name }}</div>
      </li>
      <li class="list-group-item">
        性别
        <!-- 根据性别值展示男/女，0 表示男，其余表示女 -->
        <div class="pull-right" v-if="state.user.sex === 0">男</div>
        <div class="pull-right" v-else>女</div>
      </li>
    </ul>
    <!-- 操作按钮区 -->
    <div style="margin-top: 20px">
      <el-button type="primary" @click="editUserInfo">修改基本资料</el-button>
      <el-button type="primary" @click="editPassword">修改密码</el-button>
    </div>

    <!-- 基本资料修改对话框 -->
    <vxe-modal title="修改基本资料" v-model="userInfoOpen" width="500px" show-footer show-maximize resize>
      <!-- 基本资料表单：用户名、性别 -->
      <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <!-- 基本信息对话框底部操作按钮 -->
      <template #footer>
        <div>
          <el-button type="primary" @click="submitUserInfo">保存</el-button>
          <el-button @click="userInfoOpen = false">取消</el-button>
        </div>
      </template>
    </vxe-modal>

    <!-- 修改密码对话框 -->
    <vxe-modal title="修改密码" v-model="pwdOpen" width="500px" show-footer show-maximize resize>
      <!-- 修改密码表单：旧密码、新密码、确认密码 -->
      <el-form ref="pwdRef" :model="pwdForm" :rules="pwdRules" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" placeholder="请确认密码" />
        </el-form-item>

      </el-form>
      <!-- 密码对话框底部操作按钮 -->
      <template #footer>
        <div>
          <el-button type="primary" @click="submitPwd">保存</el-button>
          <el-button @click="pwdOpen = false">取消</el-button>
        </div>
      </template>
    </vxe-modal>

  </div>
</template>

<script setup>
// 引入用户状态管理模块，用于读取/更新当前用户信息（头像、姓名等）
import useUserStore from "@/stores/modules/userStore.js";
// Vue 组合式 API
import { onMounted, reactive, ref } from "vue";
// 获取用户基本信息接口
import { getInfo } from "@/views/login/api";
// 获取本地存储的认证令牌
import { getToken } from "@/utils/auth.js";
// Element Plus 消息提示组件
import { ElMessage } from "element-plus";
// 个人中心相关接口：修改基本资料、修改密码
import { updateProfile, updatePwd } from "./api";



// 是否显示"修改基本资料"对话框
const userInfoOpen = ref(false)

// 打开修改基本资料对话框，并重置表单校验状态
const editUserInfo = () => {
  userInfoOpen.value = true
  userRef.value.resetFields()
}

// 基本资料表单数据（用户名、性别）
const form = ref({})
// 基本资料表单实例引用，用于表单校验
const userRef = ref()
// 基本资料表单校验规则
const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
})

// 提交基本资料修改：先校验，再调用接口更新，成功后刷新用户信息并同步用户名
const submitUserInfo = () => {
  userRef.value.validate(valid => {
    if (valid) {
      updateProfile(form.value).then(res => {
        userInfoOpen.value = false
        ElMessage.success('修改成功')
        getUser()
        //同步更新顶部栏显示的用户名
        userStore.name = form.value.userName
      })
    }
  })
}

// 是否显示"修改密码"对话框
const pwdOpen = ref(false)
// 修改密码表单实例引用，用于表单校验
const pwdRef = ref()
// 修改密码表单数据（旧密码、新密码、确认密码）
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})
// 修改密码表单校验规则
const pwdRules = ref({
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' }
  ],
})
// 打开修改密码对话框，并重置表单校验状态
const editPassword = () => {
  pwdOpen.value = true
  pwdRef.value.resetFields()
}
// 提交修改密码：先校验两次密码一致，再校验表单，最后调用接口
const submitPwd = () => {
  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    ElMessage.error('两次输入密码不一致')
    return
  }
  pwdRef.value.validate(valid => {
    if (valid) {
      updatePwd(pwdForm.value).then(res => {
        ElMessage.success('修改成功')
        pwdOpen.value = false
      })
    }
  })
}



//头像上传接口地址
const uploadUrl = import.meta.env.VITE_APP_BASE_API + "/system/user/profile/avatar"

//上传请求要求携带的认证请求头（Bearer Token）
const headers = { Authorization: "Bearer " + getToken() }

//用户状态管理实例，用于读取与更新头像、用户名等信息
const userStore = useUserStore()

//当前页面数据状态：保存从接口获取的用户信息
const state = reactive({
  user: {}
})

//上传前校验：仅允许 jpg 或 png 格式的图片，返回 false 则阻止上传
const beforeUpload = (file) => {
  const isJpg = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJpg) {
    ElMessage.error('上传头像图片只能是jpg或者png格式!')
  }

  return isJpg
}

//上传成功回调：接口返回 200 时将图片地址拼接到请求域名后，更新用户头像；否则提示错误
const handleAvatarSuccess = (res) => {
  if (res.code === 200) {
    userStore.avatar = import.meta.env.VITE_APP_BASE_API + res.imgUrl
  } else {
    ElMessage.error(res.msg || '修改失败')
  }
}

//上传失败回调：弹出上传失败提示
const handleAvatarError = () => {
  ElMessage.error('上传失败')
}

//获取用户信息：请求接口后将数据填充到展示状态与编辑表单中
const getUser = () => {
  getInfo().then(res => {
    state.user = res.data
    form.value = {
      userName: state.user.userName,
      sex: state.user.sex
    }
  })
}

//组件生命周期：挂载完成后加载用户信息
onMounted(() => {
  getUser()
})
</script>

<style scoped>
.list-group {
  padding-left: 0;
  list-style: none;
}

.pull-right {
  float: right;
}

.list-group-item {
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 14px;
}

.avatar-uploader .avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
</style>