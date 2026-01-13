<template>
  <div class="tabbar_right">
    <el-button
      size="small"
      icon="Refresh"
      circle
      @click="updateRefsh"
    ></el-button>
    <el-button
      size="small"
      icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>

    <el-popover
      placement="top-start"
      title="Title"
      :width="200"
      trigger="hover"
      content="this is content, this is content, this is content"
    >
      <template #reference>
        <el-button size="small" icon="Setting" circle></el-button>
      </template>
    </el-popover>

    <img
      :src="userStore.avatar"
      style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
    />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Setting',
})

import useLayoutSettingStore from '@/store/modules/setting'
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
let layoutSettingStore = useLayoutSettingStore()
let userStore = useUserStore()
let $router = useRouter()
let $route = useRoute()

let updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

let fullScreen = () => {
  // 检查当前是否处于全屏模式
  const isFullScreen = !!document.fullscreenElement

  // 如果不是全屏，则进入全屏模式
  if (!isFullScreen) {
    // 使用文档根节点的方法进入全屏
    document.documentElement.requestFullscreen()
  } else {
    // 如果是全屏，则退出全屏模式
    document.exitFullscreen()
  }
}

let logout = async () => {
  //1.向服务器发起请求【退出登录接口】，并清除仓库中的用户数据
  const { userLogout } = useUserStore() as any
  await userLogout()
  //2.跳转登录界面
  $router.push({ path: '/login', query: { redirct: $route.path } })
}
</script>

<style scoped lang="scss">
.tabbar_right {
  display: flex;
  align-items: center;
}
</style>
