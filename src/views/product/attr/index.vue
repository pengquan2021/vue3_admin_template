<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0px">
      <!-- 属性展示页的结构 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0px" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item in row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`你确定删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加与修改属性的结构 -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-table
          border
          style="margin: 10px 0px"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="80px"
            align="center"
            type="index"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ $index }">
              <el-button
                type="primary"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reqAddOrUpdateAttr, reqAttr, reqRemoveAttr } from '@/api/product/attr'
import type {
  Attr,
  AttrList,
  AttrResponseData,
  AttrValue,
} from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'
import { nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'

let categoryStore = useCategoryStore()
//存储返回的属性和属性值数据
let attrArr = ref<AttrList>([])
//card组件内容切换变量,等于0时显示table，1时显示添加与修改结构
let scene = ref<number>(0)
//收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '', //新增属性名字
  attrValueList: [], //新增属性值数组
  categoryId: '', //三级分类的id
  categoryLevel: 3, //几级分类
})
//用来存储el-input组件实例
let inputArr = ref<any>([])

//监听c3Id，当c3Id发生变化时
watch(
  () => categoryStore.c3Id,
  () => {
    //清空上一次查询的数据
    attrArr.value = []
    //保证c3Id有，才发请求
    if (!categoryStore.c3Id) return
    //调用获取数据方法
    getAttr()
  },
)

//路由组件销毁的时候
onBeforeUnmount(() => {
  //清空仓库数据
  categoryStore.$reset()
})

//获取已有属性和属性值的方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

//添加属性按钮回调
const addAttr = () => {
  //清空数据
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
  //切换结构
  scene.value = 1
}

//修改属性按钮回调
const updateAttr = (row: Attr) => {
  //切换结构
  scene.value = 1
  //将已有的属性对象赋值给attrParams
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

//删除属性按钮回调
const deleteAttr = async (attrId: number) => {
  let result = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //获取一次已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//取消按钮回调
const cancel = () => {
  //切换结构
  scene.value = 0
}

//添加属性值按钮回调
const addAttrValue = () => {
  attrParams.attrValueList.push({ valueName: '', flag: true })
  //获取最后el-inout组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存按钮回调
const save = async () => {
  //发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    //切换场景
    scene.value = 0
    //提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    //获取全部已有属性
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

//属性值表单元素失去焦点的方法
const toLook = (row: AttrValue, $index: number) => {
  //非法情况判断1
  if (row.valueName.trim() == '') {
    //删除对应属性值为空的数组
    attrParams.attrValueList.splice($index, 1)
    //提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //非法情况2
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName == row.valueName
    }
  })
  if (repeat) {
    //删除重复的属性值数组
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
  }
  //切换divlook
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //nextTick：响应式数据发生变化，获取更新的DOM组件实例
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
</script>

<style scoped></style>
