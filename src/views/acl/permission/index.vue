<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column prop="name" label="名称"></el-table-column>
    <el-table-column prop="code" label="权限值"></el-table-column>
    <el-table-column prop="updateTime" label="修改时间"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 4 ? true : false"
          @click="addPermission(row)"
        >
          {{ row.level == 3 ? '添加功能' : '添加菜单' }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level == 1 ? true : false"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>

        <el-popconfirm title="确定删除此菜单?" @confirm="removeMenu(row.id)">
          <template #reference>
            <el-button
              type="primary"
              size="small"
              :disabled="row.level == 1 ? true : false"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- dig对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
    width="500"
  >
    <el-form>
      <el-form-item label="名称">
        <el-input
          placeholder="请输入菜单名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限">
        <el-input placeholder="请输入权限值" v-model="menuData.code"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateMenu,
  reqAllPermisstion,
  reqRemoveMenu,
} from '@/api/acl/menu'
import type {
  MenuParams,
  Permisstion,
  PermisstionList,
  PermisstionResponseData,
} from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

//用于存储从接口获取的菜单数据
let permissionArr = ref<PermisstionList>([])
//用于控制对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
//用于收集添加和修改的菜单数据
let menuData = reactive<MenuParams>({
  code: '', //权限数值
  level: 0, //几级菜单
  name: '', //菜单的名字
  pid: 0, //菜单的父ID
})

//挂载时获取菜单数据
onMounted(() => {
  getHasPermission()
})

//获取菜单数据方法
const getHasPermission = async () => {
  let result: PermisstionResponseData = await reqAllPermisstion()
  if (result.code == 200) {
    permissionArr.value = result.data
  }
}

//添加按钮回调
const addPermission = (row: Permisstion) => {
  //清数据
  Object.assign(menuData, {
    id: 0,
    code: '',
    level: 0,
    name: '',
    pid: 0,
  })
  dialogVisible.value = true
  //获取数据
  console.log(row)
  menuData.level = row.level + 1
  menuData.pid = row.id as number //给谁增加子菜单
}

//编辑按钮回调
const updatePermission = (row: Permisstion) => {
  dialogVisible.value = true
  Object.assign(menuData, row)
}

//确定按钮的回调
const save = async () => {
  //发请求
  let result: any = await reqAddOrUpdateMenu(menuData)
  if (result.code == 200) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: menuData.id ? '更新成功' : '添加成功',
    })
    getHasPermission()
  }
}

//删除按钮回调
const removeMenu = async (id: number) => {
  let result: any = await reqRemoveMenu(id)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasPermission()
  }
}
</script>

<style scoped></style>
