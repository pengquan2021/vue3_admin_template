<template>
  <div>
    <el-card class="box-card">
      <!-- 添加品牌button -->
      <el-button
        type="primary"
        size="default"
        icon="plus"
        @click="addTrademark"
        v-has="'btn.Trademark.add'"
      >
        添加品牌
      </el-button>
      <!-- 表格组件：用于展示已有的平台数据 -->
      <el-table style="margin: 10px 0px" border :data="trademarkArr">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <!-- table-colum:默认展示数据用div -->
        <el-table-column label="品牌名称">
          <template #="{ row }">
            <pre style="color: brown">{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌LOGO">
          <template #="{ row }">
            <img
              :src="getImageUrl(row.logoUrl)"
              alt="无图片"
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updateTrademark(row)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.tmName}?`"
              width="250px"
              icon="Delete"
              @confirm="removeTradeMark(row.id)"
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
      <!-- 分页器组件pagination
            v-model:current-page:设置分页器当前页码
            v-model:page-size:设置每一个展示数据条数
            page-sizes:用于设置下拉菜单数据
            background:设置分页器按钮的背景颜色
            layout:可以设置分页器六个子组件布局调整-->
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :pager-count="5"
        :background="true"
        layout="prev, pager, next, jumper,->, sizes,total"
        :total="total"
        @current-change="getHasTrademark"
        @size-change="sizeChange"
      />
    </el-card>

    <!-- 对话框组件 -->

    <el-dialog
      v-model="dialogFormVisible"
      :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
      width="500"
    >
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="fromRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :show-file-list="false"
            :headers="uploadHeaders"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-error="handleUploadError"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <!-- 具名插槽：footer -->
      <template #footer>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import {
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
  reqHasTrademark,
} from '@/api/product/trademark'
import { getImageUrl } from '@/utils/image'
import type {
  TradeMark,
  Records,
  TradeMarkResponseData,
} from '@/api/product/trademark/type'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'
import type { UploadProps } from 'element-plus'

//当前页码
let pageNo = ref<number>(1)
//每页展示多少条数据
let limit = ref<number>(3)
//总共有多少条数据
let total = ref<number>(0)
//已有品牌数据的数组
let trademarkArr = ref<Records>([])
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
//新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
//获取el-from组件实例
let fromRef = ref()

//上传接口地址与请求头
const uploadAction = `${
  import.meta.env.VITE_APP_BASE_API || '/api'
}/admin/product/fileUpload`
const userStore = useUserStore()
const uploadHeaders = computed(() => ({
  token: userStore.token,
}))

//获取已有品牌数据的函数
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    trademarkArr.value = result.data.records
  }
}
//组件挂载完毕钩子：挂载时发请求，获取第一页、一页三个的已有品牌数据
onMounted(() => {
  getHasTrademark()
})

// //分页器当前页码发生变化时会触发,向父组件回传页码
// const changePageNO = ()=>{
//   getHasTrademark()
// }

const sizeChange = () => {
  //改变页码时将页码变为1
  // pageNo.value = 1
  getHasTrademark()
}

//添加按钮回调
const addTrademark = () => {
  dialogFormVisible.value = true
  //清空添加的数据
  trademarkParams.id = undefined
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  //清空校验错误提示
  // 第一种方法：ts的问号语法
  // fromRef.value?.clearValidate('tmName')
  // fromRef.value?.clearValidate('logoUrl')
  //第二种方法：使用nextTick()
  nextTick(() => {
    fromRef.value.clearValidate('tmName')
    fromRef.value.clearValidate('logoUrl')
  })
}
//修改按钮回调
const updateTrademark = (row: TradeMark) => {
  //清空校验错误提示
  nextTick(() => {
    fromRef.value.clearValidate('tmName')
    fromRef.value.clearValidate('logoUrl')
  })

  //row即为当前品牌数据
  Object.assign(trademarkParams, row) //ES6语法合并对象，作用同下三行
  // trademarkParams.id = row.id
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  dialogFormVisible.value = true
}

//确定按钮回调
const confirm = async () => {
  await fromRef.value.validate() //调用这个方法对表单全部内容进行校验
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  if (result.code == 200) {
    //添加品牌成功
    dialogFormVisible.value = false
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功',
    })
    getHasTrademark(trademarkParams.id ? pageNo.value : 1) //再次发起请求，获取全部数据（共多少条）
  } else {
    //添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败',
    })
    dialogFormVisible.value = false
  }
}
//取消按钮回调
const cancel = () => {
  dialogFormVisible.value = false
}

//上传图片之前触发的钩子函数,上传前可以约束文件类型和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传文件大小小于4M',
      })
      return false
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必PNG|JPG|GIF',
    })
    return false
  }
}

// 上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response: any) => {
  trademarkParams.logoUrl = response.data
  //图片上传成功，清理掉对应图片校验结果
  fromRef.value.clearValidate('logoUrl')
}

// 上传失败
const handleUploadError: UploadProps['onError'] = () => {
  ElMessage.error('上传失败，请稍后重试')
}

//自定义校验规则(callBack为放行函数)
const validatorTmName = (_: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}
const validatorLogoUrl = (_: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传图片'))
  }
}

//表单校验规则对象
const rules = {
  tmName: [
    {
      required: true,
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

//气泡框确认删除按钮回调
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除品牌成功',
    })
    //再次获取已有品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败',
    })
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
