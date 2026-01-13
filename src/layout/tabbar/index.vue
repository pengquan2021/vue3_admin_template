<template>
  <div class="tabbar">
    <BreadCrumb></BreadCrumb>
    <Setting></Setting>
  </div>
</template>

<script setup lang="ts">
import BreadCrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'

defineOptions({
  name: 'Tabbar',
})
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  
}
</style>
