<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="用户名：">
        <el-input type="text" placeholder="请输入用户名" v-model="keyword" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="default"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button type="primary" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" icon="Plus" @click="addRole">
      添加职位
    </el-button>
    <el-table border style="margin: 10px 0px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column
        label="职位名称"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" width="280px">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>

          <el-popconfirm
            title="确定删除该职位吗？"
            @confirm="removeRole(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 分页器 -->
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 30, 40]"
    :background="true"
    layout=" prev, pager, next, jumper,->, sizes,total"
    :total="total"
    @size-change="sizeChange"
    @current-change="getHasRole"
  />
  <!-- dialog对话框：用于添加和更改职位 -->
  <el-dialog
    v-model="dialogVisible"
    :title="RoleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位" prop="roleName">
        <el-input
          placeholder="请你输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="dialogVisible = false">
        取消
      </el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件：用于分配权限 -->

  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮权限</h4>
    </template>
    <template #default>
      <el-tree
        ref="tree"
        style="max-width: 600px"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqAllRoleList,
  reqRemoveRole,
  reqSetPermisstion,
} from '@/api/acl/role'
import type {
  MenuList,
  MenuResponseData,
  Records,
  RoleData,
  RoleResponseData,
} from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'

//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(10)
//收集用户输入的关键字
let keyword = ref<string>('')
//用于存储全部已有职位
let allRole = ref<Records>([])
//职位总个数
let total = ref<number>(0)
//获取模板setting仓库
let settingStore = useLayoutSettingStore()
//用于控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
//收集新增岗位数据
let RoleParams = reactive<RoleData>({ roleName: '' })
//获取form组件实例
let form = ref<any>()
//用于控制抽屉组件的显示与隐藏
let drawer = ref<boolean>(false)
//用于存储用户权限的数据
let menuArr = ref<MenuList>([])
//用于存储勾选的四级节点的id
let selectArr = ref<number[]>([])
//拿到tree的实例
let tree = ref<any>()
//测试数据
const defaultProps = {
  children: 'children',
  label: 'name',
}

//挂载发请求
onMounted(() => {
  getHasRole()
})

//获取职位的方法
const getHasRole = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

//分页器下拉菜单回调
const sizeChange = () => {
  getHasRole()
}

//搜索按钮的回调
const search = () => {
  getHasRole()
  keyword.value = ''
}
//重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

//添加职位按钮回调
const addRole = () => {
  //对话框显示
  dialogVisible.value = true
  //清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0,
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

//编辑按钮回调
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

//dialog确定按钮回调
const save = async () => {
  console.log(222)
  //表单校验通过才发请求
  await form.value.validate()
  //发请求
  let result: any = await reqAddOrUpdateRole(RoleParams)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: RoleParams.id ? '更新成功' : '添加成功',
    })
    getHasRole(RoleParams.id ? pageNo.value : 1)
  } else {
    dialogVisible.value = false
    ElMessage({
      type: 'error',
      message: RoleParams.id ? '更新失败' : '添加失败',
    })
  }
}

//分配权限按钮回调
const setPermission = async (row: RoleData) => {
  drawer.value = true
  //收集当前要分配职位的数据
  Object.assign(RoleParams, row)
  //发请求
  let result: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (result.code == 200) {
    console.log(result.data)
    menuArr.value = result.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })
  return initArr
}

//抽屉确定按钮的回调
const confirmClick = async () => {
  //职位的id
  const roleId = RoleParams.id as number
  //选中的id
  let arr = tree.value.getCheckedKeys()
  //半选的id
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  let result: any = await reqSetPermisstion(roleId, permissionId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '分配权限成功',
    })
    drawer.value = false
    //页面刷新
    window.location.reload()
  } else {
    ElMessage({ type: 'error', message: '分配权限失败' })
  }
}

//删除已有的职位
const removeRole = async (roleId: number) => {
  let result: any = await reqRemoveRole(roleId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({ type: 'error', message: '删除失败' })
  }
}

//自定义校验规则的回调
const validatorRoleName = (_: any, value: any, callBack: any) => {
  if (value && value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称最少两位'))
  }
}

//职位校验规则
const rules = {
  roleName: [
    {
      required: true,
      message: '请输入职位名称',
      trigger: 'blur',
    },
    {
      trigger: 'blur',
      validator: validatorRoleName,
    },
  ],
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form .el-form-item {
  margin: 0;
  margin-right: 10px;
}
</style>
