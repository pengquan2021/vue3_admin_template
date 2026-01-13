<template>
  <div class="box4" ref="map">我是地图组件</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref()
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
  let mychart = echarts.init(map.value)
  //设置配置项（美化：发光边界、航线发光、城市闪烁）
  mychart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(3,12,21,0.75)',
      textStyle: { color: '#cfefff' },
    },
    //地图组件
    geo: {
      map: 'china', //中国地图
      roam: true, //鼠标缩放的效果
      //地图的位置调试（百分比更具响应性）
      left: '6%',
      top: '6%',
      right: '6%',
      bottom: '6%',
      zoom: 1.0,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        color: '#cfefff',
        fontSize: 12,
        fontWeight: 600,
      },
      itemStyle: {
        //每一个多边形的样式（深色渐变，带发光边框）
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#07253b' },
            { offset: 1, color: '#0b3b56' },
          ],
          global: false,
        },
        opacity: 0.95,
        borderColor: 'rgba(64,224,255,0.7)',
        borderWidth: 1,
        shadowColor: 'rgba(64,224,255,0.12)',
        shadowBlur: 18,
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          areaColor: '#165e72',
          shadowColor: 'rgba(64,224,255,0.35)',
          shadowBlur: 30,
        },
        label: {
          show: true,
          color: '#ffffff',
          fontSize: 13,
          fontWeight: '700',
        },
      },
    },
    //布局位置
    grid: { left: 0, top: 0, right: 0, bottom: 0 },
    series: [
      {
        type: 'lines', //航线的系列
        zlevel: 2,
        blendMode: 'lighter',
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 北京
              [119.306239, 26.075302], // 福州
            ],
            lineStyle: {
              color: 'rgba(0,200,255,0.9)',
              width: 2,
              curveness: 0.22,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 北京
              [114.298572, 30.584355], // 武汉
            ],
            lineStyle: {
              color: 'rgba(0,200,255,0.8)',
              width: 2,
              curveness: 0.18,
            },
          },
        ],
        effect: {
          show: true,
          symbol: 'arrow',
          color: '#a6ffff',
          symbolSize: 6,
          period: 4,
          trailLength: 0.25,
        },
        lineStyle: { opacity: 0.9 },
      },
      {
        name: '城市',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 3,
        rippleEffect: { brushType: 'stroke', scale: 3 },
        label: { show: false },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#a6ffff',
          shadowBlur: 12,
          shadowColor: '#53f0ff',
        },
        data: [
          { name: '北京', value: [116.405285, 39.904989] },
          { name: '福州', value: [119.306239, 26.075302] },
          { name: '武汉', value: [114.298572, 30.584355] },
        ],
      },
    ],
  })
})
</script>

<style scoped>
.box4 {
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 8px;
  box-shadow: none;
  border: 1px solid rgba(64, 224, 255, 0.04);
  overflow: hidden;
}
</style>
