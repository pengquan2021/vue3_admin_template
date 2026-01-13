<template>
  <el-card>
    <el-table border style="margin: 10px 0px" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="180px"
        prop="skuName"
      ></el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="180px"
        prop="skuDesc"
      ></el-table-column>
      <el-table-column label="图片" width="180px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column
        label="重量(g)"
        width="180px"
        prop="weight"
      ></el-table-column>
      <el-table-column
        label="价格(元)"
        width="180px"
        prop="price"
      ></el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateSku"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>

          <el-popconfirm
            :title="`确定删除${row.skuName}?`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getHasSku"
      @size-change="handler"
    />
    <!-- 抽屉组件：用于展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px 5px"
              v-for="item in skuInfo.skuAttrValueList"
              :key="item.id"
            >
              {{ item.valueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag
              style="margin: 5px 5px"
              v-for="item in skuInfo.skuSaleAttrValueList"
              :key="item.id"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0px">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" style="width: 100%; height: 100%" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import {
  reqCancelSale,
  reqRemoveSku,
  reqSaleSku,
  reqSkuInfo,
  reqSkuList,
} from '@/api/product/sku'
import type {
  SkuData,
  SkuInfoData,
  SkuResponseData,
} from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'

//分页器当前页码
let pageNo = ref<number>(1)
//每页展示几条数据
let pageSize = ref<number>(10)
//总共有几条数据
let total = ref<number>(0)
//用于存储获取到的sku数组
let skuArr = ref<SkuData[]>([])
//用于控制抽屉组件展开合收起
let drawer = ref<boolean>(false)
//用于存储抽屉组件sku详情的数据
let skuInfo = ref<any>({})

//组件挂载完毕
onMounted(() => {
  getHasSku()
})
//获取sku数据的方法
const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code == 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}

//分页器下拉菜单变化时触发，一页多少条数据
const handler = () => {
  getHasSku()
}

//商品上架/下架操作按钮回调
const updateSale = async (row: SkuData) => {
  //isSale == 1，商品状态为上架,需要更新为下架
  if (row.isSale == 1) {
    await reqCancelSale(row.id as number)
    ElMessage({ type: 'success', message: '下架成功' })
    getHasSku(pageNo.value)
  } else {
    await reqSaleSku(row.id as number)
    ElMessage({ type: 'success', message: '上架成功' })
    getHasSku(pageNo.value)
  }
}

//编辑按钮回调，更新已有的sku
const updateSku = () => {
  ElMessage({ type: 'success', message: '程序员努力更新中……' })
}

//查看sku商品详情的按钮的回调
const findSku = async (row: SkuData) => {
  drawer.value = true
  let result: SkuInfoData = await reqSkuInfo(row.id as number)
  skuInfo.value = result.data
}

//删除按钮操作回调
const removeSku = async (id: number) => {
  let result: any = await reqRemoveSku(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功 ' })
    //重新获取sku
    getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
