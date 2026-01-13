<template>
  <div>
    <!-- 三级分类 -->
    <Category :scene="scene"></Category>
    <!-- 卡片 -->
    <el-card style="margin: 10px 0px">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
        >
          添加SPU
        </el-button>
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column
            label="序号"
            align="center"
            width="80px"
            type="index"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="SPU操作">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看SKU列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定删除${row.spuName}吗？`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @size-change="changeSize"
          @current-change="getHasSpu"
        />
      </div>
      <!-- 添加或修改spu子组件 -->
      <SpuForm
        ref="spu"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加sku子组件 -->
      <SkuForm
        ref="sku"
        v-show="scene == 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- dialog对话框，展示已有的sku数据 -->
      <el-dialog title="SKU列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type {
  HasSpuResponseData,
  Records,
  SkuData,
  SpuData,
} from '@/api/product/spu/type'
import { reqHasSpu, reqRemoveSpu, reqSkuList } from '@/api/product/spu/index'
import useCategoryStore from '@/store/modules/category'
import { onBeforeUnmount, ref, watch } from 'vue'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
import { ElMessage } from 'element-plus'

//分类仓库
let categoryStore = useCategoryStore()
//控制场景的数据：0 显示已有spu数据  1 添加或修改spu数据  2 添加sku数据
let scene = ref<number>(0)
//当前页码
let pageNo = ref<number>(1)
//每页展示多少条数据
let pageSize = ref<number>(3)
//存储已有的Spu数据
let records = ref<Records>([])
//存储spu数据的总个数
let total = ref<number>(0)
//获取子组件实例spu
let spu = ref<any>()
//获取子组件实例sku
let sku = ref<any>()
//用于存储sku数据
let skuArr = ref<SkuData[]>([])
//控制dialog显示与隐藏
let show = ref<boolean>(false)

//监听三级分类category3Id的变化
watch(
  () => categoryStore.c3Id,
  () => {
    //保证有c3Id才发请求
    if (!categoryStore.c3Id) return
    getHasSpu()
  },
)

//获取三级分类下已有SPU数据的方法
const getHasSpu = async (pager = 1) => {
  //修改当前页码
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

//分页器页码变化时触发
const changeSize = () => {
  getHasSpu()
}

//添加spu按钮的回调
const addSpu = () => {
  // 切换到场景1
  scene.value = 1
  //调用子组件方法，初始化数据
  spu.value.initAddSpu(categoryStore.c3Id)
}

//子组件spuForm的自定义事件：告诉父组件场景切换为0
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value)
  } else {
    //添加留在第一页
    getHasSpu()
  }
}

//修改spu按钮的回调
const updateSpu = (row: SpuData) => {
  //切换到场景1
  scene.value = 1
  spu.value.initHasSpuData(row)
}

//添加sku按钮回调
const addSku = (row: SpuData) => {
  //切换场景为2
  scene.value = 2
  //调用子组件方法初始化sku数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看sku列表按钮回调
const findSku = async (row: SpuData) => {
  let result = await reqSkuList(row.id as number)
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}

//删除已有spu按钮回调
const deleteSpu = async (row: SpuData) => {
  let result = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //重新获取剩余spu数据
    getHasSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//路由组件销毁前，清空仓库关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>
