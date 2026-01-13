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
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
    <el-button
      type="primary"
      size="default"
      :disabled="selectIdArr.length > 0 ? false : true"
      @click="deleteSelectUser"
    >
      批量删除
    </el-button>
    <el-table
      border
      style="margin: 10px 0px"
      :data="userArr"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`确定删除${row.username}?`"
            width="250px"
            @confirm="deleteUser(row.id)"
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
    :page-sizes="[5, 7, 9, 11]"
    :background="true"
    layout=" prev, pager, next, jumper,->, sizes,total"
    :total="total"
    @size-change="handler"
    @current-change="getHasUser"
  />

  <!-- 抽屉组件1：用于添加和修改账户信息 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户密码"
          prop="password"
          v-if="userParams.id ? false : true"
        >
          <el-input
            placeholder="请输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>

  <!-- 抽屉组件2：用于分配角色 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedRolesChange"
          >
            <el-checkbox
              v-for="role in allRole"
              :key="role.id"
              :label="role.roleName"
            >
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="comfirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqAddOrUpdateUser,
  reqAllRole,
  reqRemoveUser,
  reqSelectUser,
  reqSetUserRole,
  reqUserInfo,
} from '@/api/acl/user'
import type {
  AllRole,
  AllRoleResponseData,
  Records,
  SetRoleData,
  User,
  UserResponseData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, reactive, ref } from 'vue'
import type { CheckboxValueType } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'

//默认页码
let pageNo = ref<number>(1)
//一页展示几条数据
let pageSize = ref<number>(5)
//用户总个数
let total = ref<number>(0)
//存储全部用户的数组
let userArr = ref<Records>([])
//用于控制抽屉的展开与收缩
let drawer = ref<boolean>(false)
//用于控制分配角色抽屉的展开与收缩
let drawer1 = ref<boolean>(false)
//用于收集更新或修改的账号信息
let userParams = reactive<User>({
  username: '',
  name: '',
  password: '',
})
//用于获得form组件实例
let formRef = ref<any>()
//多选框相关数据
const checkAll = ref(false)
const isIndeterminate = ref(true)
//存储全部职位的数据
let allRole = ref<AllRole>([])
//存储用户已有职位的数据（el-checkbox-group 需要 string[] 或 number[]，这里用 roleName 字符串数组）
let userRole = ref<string[]>([])
//用于存储批量删除的用户id
let selectIdArr = ref<User[]>([])
//收集用户输入的关键字
let keyword = ref<string>('')
//获取模板setting仓库
let settingStore = useLayoutSettingStore()

//挂载时发请求获取账号信息
onMounted(() => {
  getHasUser()
})

//获取已有用户信息的方法
const getHasUser = async (pager = 1) => {
  //收集当前页码
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (result.code == 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

//分页器下拉菜单回调
const handler = () => {
  getHasUser()
}

//添加账户按钮回调
const addUser = () => {
  //展开抽屉
  drawer.value = true
  //清空数据
  Object.assign(userParams, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  //清除表单校验的错误信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

//修改账户按钮回调
const updateUser = (row: User) => {
  //展开抽屉
  drawer.value = true
  //存储收集已有的账号信息
  Object.assign(userParams, row)
  //清除表单校验的错误信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}

//抽屉确定按钮的回调
const save = async () => {
  //表单校验通过后才发请求
  await formRef.value.validate()
  //发请求
  let result: any = await reqAddOrUpdateUser(userParams)
  if (result.code == 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功',
    })
    // getHasUser(userParams.id ? pageNo.value : 1)
    //浏览器自动刷新一次
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage({
      type: 'error',
      message: userParams.id ? '更新失败' : '添加失败',
    })
  }
}

//抽屉取消按钮回调
const cancel = () => {
  drawer.value = false
}

//分配角色按钮回调
const setRole = async (row: User) => {
  Object.assign(userParams, row)
  //获取全部职位数据和当前用户已有的职位数据
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (result.code == 200) {
    allRole.value = result.data.allRolesList
    // 将对象数组映射为 roleName 字符串数组，供 el-checkbox-group 使用
    userRole.value = result.data.assignRoles.map((role) => role.roleName)
    drawer1.value = true
  }
}

//复选框相关的方法
const handleCheckAllChange = (val: CheckboxValueType) => {
  // 将对象数组映射为 roleName 字符串数组
  userRole.value = val ? allRole.value.map((role) => role.roleName) : []
  isIndeterminate.value = false
}
const handleCheckedRolesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

//分配职位确定按钮的回调
const comfirmClick = async () => {
  //收集参数
  // 根据选中的 roleName 从 allRole 中找到对应的角色对象，获取 id
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value
      .map((roleName) => {
        const role = allRole.value.find((r) => r.roleName === roleName)
        return role?.id
      })
      .filter((id): id is number => id !== undefined),
  }
  //发请求
  let result: any = await reqSetUserRole(data)
  if (result.code == 200) {
    drawer1.value = false
    ElMessage({
      type: 'success',
      message: '分配职位成功',
    })
    getHasUser(pageNo.value)
  }
}

//确认删除按钮的回调
const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

//复选框勾选时触发的事件
const selectChange = (value: any) => {
  selectIdArr.value = value
}

//批量删除按钮的回调
const deleteSelectUser = async () => {
  //整理批量删除的参数
  let idsList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  //发请求
  let result: any = await reqSelectUser(idsList)
  if (result.code == 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

//搜索按钮的回调
const search = () => {
  console.log(keyword.value)
  getHasUser()
  keyword.value = ''
}

//重置按钮的回调
const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
//表单校验username时触发的方法
const validatorUsername = (_: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户姓名至少5位'))
  }
}
//表单校验username时触发的方法
const validatorName = (_: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户昵称至少5位'))
  }
}
//表单校验username时触发的方法
const validatorPassword = (_: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack()
  } else {
    callBack(new Error('用户密码至少6位'))
  }
}

//表单校验规则对象
const rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}
</script>
N

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
