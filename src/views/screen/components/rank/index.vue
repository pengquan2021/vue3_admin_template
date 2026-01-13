<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取DOM节点
const charts = ref()
//组件挂载完毕
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  const mychart = echarts.init(charts.value)
  // 数据名字不能重复，否则会混乱
  const dataZoomMove = {
    start: 0,
    end: 13,
  }
  const xAxisData = [
    '夷陵区',
    '点军区',
    '西陵区',
    '伍家岗区',
    '高新区',
    '枝江区',
    '宜都区',
    '当阳市',
    '远安县',
    '兴山县',
    '常山县',
    '远安县1',
    '兴山县2',
    '常山县3',
    '燎原先',
    '华兴县',
    '希望县',
    '辽远县',
    '伍家岗区1',
  ]
  const unit = '元'
  const chartData = [
    72, 65, 60, 53, 50, 47, 45, 39, 39, 36, 33, 32, 32, 26, 26, 22, 14, 6, 3, 2,
    1, 1,
  ]
  const rateData = [
    12, 15, 20, 23, 1.2, -7.5, 45, 7.7, 10.9, 6, -23, 22, 12, -24, 56, 12, 24,
    56, 23, 20, 19, 15, 15,
  ]
  const showRate = true // 是否显示同比数据列
  const option = {
    //你的代码
    backgroundColor: '#021032',
    tooltip: {
      show: false,
      trigger: 'axis',
    },
    dataZoom: [
      {
        show: chartData.length > 13 ? true : false, // 为true 滚动条出现
        realtime: true,
        type: 'slider', // 有type这个属性，滚动条在最下面，也可以不行，写y：36，这表示距离顶端36px，一般就是在图上面。
        height: '10%', // 表示滚动条的高度，也就是粗细
        startValue: dataZoomMove.start, // 表示默认展示20%～80%这一段。
        endValue: dataZoomMove.end,
        width: 6,
        right: '20',
        top: '0%', //位置和grid配置注意下
        yAxisIndex: [0, 1], //关联多个y轴
        moveHandleStyle: {
          color: 'rgba(89, 202, 241,.5)',
        },
        moveHandleSize: '6',
        emphasis: {
          moveHandleStyle: {
            color: 'rgba(89, 202, 241,.5)',
          },
        },
        textStyle: {
          color: 'rgba(255,255,255,0)',
        },
        backgroundColor: 'rgba(255,255,255,.1)',
        borderColor: 'rgba(255,255,255,0)',
        fillerColor: 'rgba(0,0,0,0)',
        handleSize: '6',
        handleStyle: {
          color: 'rgba(255,255,255,0)',
        },
        brushStyle: {
          color: 'rgba(129, 243, 253)',
        },
      },
      {
        //没有下面这块的话，只能拖动滚动条，鼠标滚轮在区域内不能控制外部滚动条
        type: 'inside',
        yAxisIndex: 0,
        zoomOnMouseWheel: false, //滚轮是否触发缩放
        moveOnMouseMove: true, //鼠标滚轮触发滚动
        moveOnMouseWheel: true,
      },
    ],
    grid: {
      containLabel: true,
      bottom: '2%',
      left: '6%',
      top: '8%',
      right: '5%',
    },
    xAxis: [
      {
        type: 'value',
        // max: 200,
        axisLabel: {
          show: true,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      {
        show: showRate,
        name: '同比',
        type: 'value',
        position: 'top',
        nameTextStyle: {
          verticalAlign: 'center',
          align: 'center',
          color: '#FFFFFF',
          padding: [0, 0, 0, 130],
          fontSize: 12,
        },
        // max: 200,
        axisLabel: {
          show: true,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: 'category',
        data: xAxisData,
        inverse: true,
        axisLabel: {
          fontSize: '14px',
          inside: false,
          interval: 0,
          verticalAlign: 'center',
          padding: [5, 0, 0, 0],
          margin: 10, //刻度标签与轴线之间的距离
          formatter: (value: string, _index: number) => {
            // 可选：手动实现「每N个字换行」（若自动换行不生效，启用此逻辑）
            const lineBreakValue =
              value.length > 4
                ? value.slice(0, 4) + '\n' + value.slice(4)
                : value
            // console.log("formatterform atter", value, index);
            if (xAxisData.indexOf(value) + 1 < 4) {
              return `{img${xAxisData.indexOf(value) + 1}|${
                xAxisData.indexOf(value) + 1
              }} {a|${lineBreakValue}}`
            } else {
              return `{img4|${
                xAxisData.indexOf(value) + 1
              }} {a|${lineBreakValue}}`
              // return `{img3|${index + 1}} {a|${value}}`;
            }
          },
          rich: {
            a: {
              fontSize: '14px',
              color: '#FFFFFF',
              padding: [0, 0, 0, 0],
              width: 60,
              align: 'right',
            },
            b: {
              fontSize: '18px',
              color: '#8891B0',
              padding: [4, 15, 0, 15],
              align: 'left',
            },
            img1: {
              width: 26,
              height: 22,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              align: 'center',
              fontWeight: 700,
              padding: [3, 5, 0, 0],
              verticalAlign: 'middle',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAmCAYAAACGeMg8AAAAAXNSR0IArs4c6QAAAvlJREFUWEdjZMAFZp5hZWB7zM3Azc7K8OMPDwMbMytOtdSQYGX8xvCd4RPD18ffGdLTf5NqJCOGhob9LAzqvyQZGP9wIsuVnjwiTqrhpKjvNrd5CVcP8tSbxy9J8RCqR9bvF2D4+U0MZODqTav17R7f9Rf4/tOG7d8feVIcRY7aL6ysh66Kiq9bq6p9Duypn+xvGeJd3hJrFsIji3ZyM7D9kQZp/NzfNJvn9287Yg2hprpfTCwPa2ydY0n1DMQjoOSk8U0JlHy6Du48RE2HkWPWPUHhLuXUgrlgvR+f3CcmiUE8smqnIsO/P6wDGRPoHoZ7BlQAJHq/IBQgjAzbtrEzfPovf2LJTE/zZ08mENJAT/kye3c7YpMYI8PcjbwM3CySd2dPSFZ6/7aMng4lZBcpSYyRYfEOSQbWv7yDKVkhexDuGQJFMiPD0l2qDMy/Gf931d4kFEIDJU9MEmNkWLFVDeTAwewRUB3TZOVUA84vOEqxIeERUEDDkxgTy2+G9w+eoBfJQ8YjIM/gS2JDyiMotT5aEhtSHsGXxIacR3AlsSHpEdQk9u8JQ7rvtyHpEWxJbMh6BOSZNRp6YaF+oRdBfZfh4RFWxmGStMLc7w/JGAFldvaSejdIx2sIZ3Z43kDqdA25GEFpc4W534e1yIeUR7AlqSHpEeTiFn2oaMjECK4kNaRiBF+SQnhk0SZF0Ljuz57GXfQYUSSnu0xcV3f5TlnQOO9g9QihJIWIkfnrBRg42cReTu2oE/v6NZqcEKOVHlBfnbewLpWYEUdGBtD0Af9LxcE2QIeSL4gY0IYMmUKT12CKlYMyisUOUUlbGEDjWcFeTwjFOsQj0GFTBiaW3z+7avcPdKaHJynQiAlS7Y3PMxjTCqAR+ZIzR9IHKr+QmqQQmR3Zm0u28TGw/JcACYEmejzuXs9h+/sfPMlD61h6w8F55K6Q8BqLmPTtYCcRmaSwewQkOhim3oicSkCOA8w5RJgsqDRjecrBwMbOw/D/F8dgnwwFAHUo8lwbJ9efAAAAAElFTkSuQmCC',
              },
            },
            img2: {
              width: 26,
              height: 22,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              align: 'center',
              fontWeight: 700,
              padding: [3, 5, 0, 0],
              verticalAlign: 'middle',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAmCAYAAACGeMg8AAAAAXNSR0IArs4c6QAAA9tJREFUWEftWW1oU1cYfs5JcpPc296bTtTOtmxrqSJMxqBjY7MO0dmhLs6vlIA4Yyv+2tiP1ZEho4zNj82PH8JYaUUs6dDgB5K2Uj/+WP9svybzh3YgSbXdjLomWdKkaXPPOI1ira25iU3qHcuvS877Pud9zvu+5+N9Cab7tbSYIFVYITARBiZilBinlZ2JAZpKIJaKIHAtguZmNVtI8pSC12sArKVQqZQt2IzIp1QGokbgtAdBCNOK+SSR9h4JwlgZV3YnvHNdIxfXlbDoApnElgos9YpW0Fzkhmhx72X6xpHNRe5r4/pJYwhb64JasR4TmUCiL7yzsZrdadIKMpNyMWK+ssvS0Pyjec0AksYBbK2LacFPE+HhpEpV/DMc2tQmI16rRTlfMrdo6fdV8tGjYMkknOv9WuZ5SMRXxnNiNj0x2djdwpb3vhOd90HJEByr72UiQ8B3J6X8NZ4TexLHr2ZSKNT4MDEHmiwNrvEQC6t3sPOj4WfNTeDplmFkpX3hHY3VbHBW8mI6A/8gC35YqLS2gW/NDnv/s4l4u0qhQh6K1LfZ1Ois5sZUhn5l+WTpXovjHgTzA2xY+WA6MgSnOyv5YZcM2W+akCpU5GieJwJrr2I71TiuEBf74VqemEqZ4ETXQj7AQmtuakYvsOANWn5gsdzSCmaMw1l3W7dEGAjcVlftfvPGIKjhPhwf/j2ZjC48wo0OQeotsXnTIRYkAXy2emQiGd0Q4UbfoBUHFss/tYJaYnCsGNAtERUUuyyu9w9aNvwFsxjE+uWhR2R05RFu9CAp2VemeI6B35IXvexHTc0o/193RLjRvxgXff5O0aHzYKYonKsGdUskBepvEhu2HRY+/hNUuAvHB2FdeiQdYnP2lSntx0DHVMyV/bolwsn4TG9vsktf/45Rwz//EynwLeWp6YLU1jFf7vhG16HFk91o61wJMIOuk73L8NbGtcXN13W9/Q7Rot6X5JONuj4QVRC/odi3AgZi1PUV5T9xacx8jT91oRpjo+RFfiHyuqnbuj3Dw6qjs5LH3ItMRNtT9+dL80FHlJGw/UK+67u5HKIxYgkUKadXZS4++HwiYrRc/+UgTrWjs7J/ePu3FamgM5dVy5dOdgU6boWnW3aPnVyyJ3HcA+DVfBmWDS4vmUrKmXRIaSqZPkJv75nXF2/4YrbaCZNJek3L6uulL3/TXsSeiNDeMy8aX/erxBJ5bepk8kzubYWJyJ5uuS+249NqNsBrSAUPszgRAqJyNh1SWTd6pliiEy3vVtWQW7VzWHStyOJvCkhVZlrJ5xnn74sr9PVzubbe/gXTndois1EjpQAAAABJRU5ErkJggg==',
              },
            },
            img3: {
              width: 26,
              height: 22,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              align: 'center',
              fontWeight: 700,
              padding: [3, 5, 0, 0],
              verticalAlign: 'middle',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAmCAYAAACGeMg8AAAAAXNSR0IArs4c6QAAA+VJREFUWEftWW1MU2cUft7bSwutK6IRO4FsowGs8SNLWDSbuBidLH7U75ImRq1g/KXxx3DpYhaybE433X4sWUbAGElZtNEZU8Dgxx/RH/pLgtFSlLQICEUo1H5A23vv8sKMDMHeVlq8xv666XvO857nPee8H+cQTPWrrEyBKicNckEJmaBEmLBTyk7HAMMNw8954Wr2oqKCjxWSvKJgtcqANA14RhUr2LTIc7wAwnth1LtBiCAW8/9EahpVkEeyqLJ5jnWeKePa5gzWt0DN+FfKCfeRWNB45Dz8B003Asv+2Nlhbh7VD7GD2F3sFov1ksg4Eg7tgbI8RWe5WJDplPNziptHeksr/hzc0IUQ24XdxX4x+GNEaDjxKi39HMrfUa1mg0VilBMl0x7W/KJtO30aQigE41anmHn+I2LLojkxk56YaOzRvl1f/NRnfAaGeGBY3xeNDAHdndKzP6E5cUxz9lY0hWSNB3iFq7yn1DQaYkN8Jw5sCrxubgJLgxqsoHFo95flKbpnJC+mMrBtZMGv+Y+rqkG3ZoO+4/VErPUa8FB7FpZUz2Z8M5obkxn6Xc+elT8PGPogV/Rj29r+qcgQXKzLpYddSKdvTSFcsiJH9DzeSFpTuuNC2ahCUNkB0+rhyZQJztXn0wFh0YZW0ehJFrQPZ5/UtVdWQWCDMBY/kSwRAQTmXlPRif7tbjCyZzB8PTCRjCQ8Qo0e5FVNGXbrWIi5iQuH1o+MJyMZItRoeyjnpO7RX1VgUv0wrOmSLBEeDI48NX15yrOtBwqlG1tXD74gIymPUKO7QxnHsx5ZzoDekgs+dKKwMEz/lxwRavSdQMHhFc7frkBI8cG4rluyRDgwzvKe0r2/D2x5CkbeC8NXQ5L0yGiIReYez3LUnAET4TFP7ZQsEUrGFli+Q+/8vgVh2fP3RJJ8S3llOjc3u3Z+a+0Pkg4tmuzsg7q1gCCTdLLX+z/bvtFVcV/S26+Hn9U0x36+TNIHIg/ilLXY1kBGWElfUd6JS2P0a/yFq3mIhMnb/EKkdVNz774oD6vaulwac28zEXFP3b+vzwczkj6i019NdH03nkPUz6e6ZtkvrotefLDZlPAz2dIvB1GqtXW5Hbp9P+awbmM8q5YondgKdNQKS4PanHl+yTHNWQuAjxNlWCy4tGSqsv8zFlKiSqYv0GsaMx260m9mqp0wkaTVu6qkpPPbe+KL2OMRahozfUs331Uxwwlt6kTzTPxthfHIlga1o2D/wTxFF60hJT3MgoLcpXx4aSykYm70TLJE525/ri1MaS+aK/dtVJLgp3LC5UZbyTcZp++Lm8HFl+Ntvf0L8ffwIg9/63EAAAAASUVORK5CYII=',
              },
            },
            img4: {
              width: 26,
              height: 22,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              align: 'center',
              fontWeight: 700,
              padding: [3, 5, 0, 0],
              verticalAlign: 'middle',
              backgroundColor: {
                image:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAmCAYAAACGeMg8AAAAAXNSR0IArs4c6QAAA7lJREFUWEftWUtMU1kY/s65ty1toY4PaFGUsUTZ6MKEsOARYlBQ4mgcTSfdmDEhceVkFronxoVRV7oyYkwImAkZF4aHgmYmWm0cokYyJlIzo71VrF6oILU82t5zzUGMiNTeVkq9xq5uev7/O993zv+fx38IEv3OnDHAutoMo2qBoFoQI2JC24VooMokIsoYpP4xNDWxVCHJJw7t7QJgdoBRa6pgC2KvMBWEjcG9UwYhqlbMj4W09FhhjK/izmvelOQ7xot2UdWwUmBiFQUt1gqajp1CY56QIXTat+xe/7R/VBzFvnpZK9YHIbNElA/XNJpi1sNaQRbSjhHlhj9voGnQKg0iKg5iX31EC/47ITycmLWEf1YE65oFiNVanDNlMyVOHO/L//sc1GgU7t1+Lf3MCOlYxXMimzMxl2zAOlAp2R4Pg5IRuBqGkokh4KvTkqK1PCeKw6U3kzksVrtCmSTlPtw/HWKv2TMc+Gn8c30TtHbbIKqOcrmm0aRkJy8SEZwyRE70rbjeDL40u3YGPi+kvcsBBlvFy7pmgWU3N+YjKuX5qgK5/w/BaArh5y2hRGIILnY6+WZXFdzuI/h0W1msUErUj4K4x1vY2zjdPmEJYP/myflsCf7oWs8bqoMNvmyTTtT/uBg+eTffcxaqOAF3/VPdCuHEJduj6oD1PxlUGIZr26u5YnQxI5y0QuMer30mxGQi4beGqdlidCOEkx43Rk7eXX79LGhOBK7aQd0KUaFCyhuoeZr75AVMFhm7N4++F6OrGeGko3Ty2D/2v86Dn5JLC/0oK4vx/3UnhJMOG0d/v7/cexmq4Q3cdc91K4QR1S/ZfL8+szwOghpfwrX1tS5n5KMQo3GGfJtft0K4mKEcee/A0jv/IiaEvwvJ9nEmRqNtt+3XjkDPocWT/ZbjyhZAFXSd7CNmec+DH+480PXyy6stXvvVRr1viH5PQVctBCLq+ojyTRwakx/j/+xdh3iMfM03RG0Xq7ZOJ4+5r1mItqvuhWt20KkllcFtvZmu76aziSpUkbz2nrrkxYeODgsitEj/5SAuta3TWR6qPWpSctzpjFqmfFIr0HEWrd22NZPOjcXh0lYAP2aKWCq4vGTqtV95F1KaSqbv0Vt6CsrHKg9l6zlhrkg558UvvqX37msvYs9GaOkpqBip7ROYkNFHnWQzk/6zwmzk1m5bWajmoJlZeJly0cNMAZO8hTMhlfJDzzxDtOFUoMSMZdUCM+0QVbqJgDqTjeSXtPP7xYjh1aV0n97eAuRE6iINCWonAAAAAElFTkSuQmCC',
              },
            },
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#13387a',
          },
        },
      },

      {
        type: 'category',
        data: xAxisData,
        inverse: true,
        padding: [0, 0, 0, 0],
        axisLabel: {
          inside: false,
          verticalAlign: 'center',
          padding: [0, 0, 0, 0],
          margin: 10, //刻度标签与轴线之间的距离
          formatter: (value: string, _index: number) => {
            const idx = xAxisData.indexOf(value)
            if (
              idx === -1 ||
              idx >= chartData.length ||
              (showRate && idx >= rateData.length)
            )
              return ''
            if (showRate) {
              const rate = rateData[idx]!
              return `{a|${chartData[idx]}${unit}}{b| ${
                rate > 0 ? `+${rate || '-'}%` : `${rate || '-'}%`
              }}`
            } else {
              return `{a|${chartData[idx]}${unit}}`
            }
          },
          rich: {
            a: {
              fontSize: 12,
              fontFamily: 'Barlow Condensed SemiBold',
              color: '#FFFFFF',
              padding: [4, 0, 0, 0],
              width: 50,
            },
            b: {
              color: '#A08F19',
              fontSize: 12,
            },
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#13387a',
          },
        },
      },
    ],
    series: [
      {
        // name: "主系列",
        type: 'bar',
        data: chartData,
        barGap: '0',
        zlevel: 10,
        color: '#00CCFF',
        showBackground: true,
        verticalAlign: 'center',
        backgroundStyle: {
          color: 'rgba(0, 204, 255, 0.09803921568627451)',
          borderRadius: 30,
        },
        itemStyle: {
          borderRadius: 30,
          borderWidth: 0,
        },
        barWidth: 15,
      },
    ],
  }
  //设置配置项
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box6 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin-left: 5px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
