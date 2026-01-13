<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <!-- 渲染layout一级路由组件的子路由 -->
        <component :is="Component" v-if="falg" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { nextTick, ref, watch } from 'vue'

let layoutSettingStore = useLayoutSettingStore()

//控制当前组件是否刷新重建
let falg = ref(true)

//监听仓库内部数据是否变化
watch(
  () => layoutSettingStore.refsh,
  () => {
    falg.value = false
    nextTick(() => {
      falg.value = true
    })
  },
)
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 1s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
