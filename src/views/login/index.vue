<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="default"
              class="login_btn"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
import { Lock, User } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

//手机登录账号密码数据
let loginForm = reactive({ username: 'admin', password: '111111' })
let loading = ref(false)
let loginForms = ref() //获取el-from组件

//登录回调
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()
let login = async () => {
  //保证全部表单校验通过再发请求
  await loginForms.value.validate()
  //加载效果
  loading.value = true
  //点击登录按钮，通知仓库发送登录请求
  //1.请求成功->首页展示数据的地方
  //2.请求失败->弹出登录失败信息
  try {
    //保证登录成功
    await userStore.userLogin(loginForm)
    //判断登录，是否有query参数，有则跳转query参数，无则跳转首页
    let redirect: any = $route.query.redirct
    //跳转到展示数据首页
    $router.push({ path: redirect || '/' })
    //登录成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    //登录失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

//自定义校验规则函数
const valitatorUserName = (_: any, value: any, callback: any) => {
  //rule：校验规则对象   valve：收集到的表单文本内容   callback：函数，如果符合条件callback放行，不符合callback注入错误提示信息
  if (value.legth >= 5) {
    callback
  } else {
    callback(new Error('账号长度至少五位'))
  }
}
const valitatorPassword = (_: any, value: any, callback: any) => {
  //rule：校验规则对象   valve：收集到的表单文本内容   callback：函数，如果符合条件callback放行，不符合callback注入错误提示信息
  if (value.legth >= 5) {
    callback
  } else {
    callback(new Error('密码长度至少五位'))
  }
}

//定义表单校验规则
const rules = {
  username: [
    // { required: true, message: '用户名不能为空', trigger: 'blur' },
    // {//required表示这个规则是必校验的
    //   required: true,min: 6,max: 10,message: '账号长度在6-10之间',trigger: 'change',
    // },
    //自定义规则
    { trigger: 'change', valitator: valitatorUserName },
  ],
  password: [
    // {
    //   required: true,
    //   min: 6,
    //   max: 15,
    //   message: '密码长度在6-15之间',
    //   trigger: 'change',
    // },
    //自定义规则
    { trigger: 'change', valitator: valitatorPassword },
  ],
}
</script>

<style lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  padding: 40px;
  .login_form {
    position: relative;
    width: 70%;
    top: 25vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
  }
  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0px;
  }
  .login_btn {
    width: 100%;
  }
}
</style>
