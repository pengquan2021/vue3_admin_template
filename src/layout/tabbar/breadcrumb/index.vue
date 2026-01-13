<template>
  <div class="tabbar_left">
    <!-- 左侧静态 -->
    <el-icon style="margin-right: 10px" @click="changeIcon">
      <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <!-- 左侧面包屑 -->

    <el-breadcrumb separator-icon="ArrowRight">
      <!-- 面包屑动态展示路由名字与标题 -->
      <el-breadcrumb-item
        v-for="(item, index) in $route.matched"
        :key="index"
        v-show="item.meta.title"
        :to="item.path"
      >
        <!-- 图标 -->
        <el-icon style="vertical-align: top">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- 标题 -->
        <span>{{ item.meta.title }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'

let layoutSettingStore = useLayoutSettingStore()

defineOptions({
  name: 'Breadcrumb',
})

//图标切换方法
const changeIcon = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<style scoped lang="scss">
.tabbar_left {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
</style>
