<template>
  <div class="container">
    <!-- 数据大屏展示内容的区域 -->
    <div class="screen" ref="screen">
      <!-- 顶部 -->
      <div class="top">
        <Top></Top>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <!-- 左侧 -->
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <!-- 中间 -->
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <!-- 右侧 -->
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="year"></Year>
          <Count class="count"></Count>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Age from './components/age/index.vue'
import Sex from './components/sex/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Count from './components/count/index.vue'

//获取数据大屏div的DOM元素
let screen = ref()
//挂载时
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

//卸载时
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

//处理窗口大小改变的方法
const handleResize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}

//获取大屏缩放比例的方法
const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .rank {
          flex: 1.5;
        }
        .year {
          flex: 1;
        }
        .count {
          flex: 1;
        }
      }
      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
