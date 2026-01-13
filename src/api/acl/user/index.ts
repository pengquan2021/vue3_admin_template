import request from '@/utils/request'
import type {
  AllRoleResponseData,
  SetRoleData,
  User,
  UserResponseData,
} from './type'

//用户管理模块接口
enum API {
  //获取全部已有的账号信息
  ALLUSER_URL = '/admin/acl/user/',
  //新增一个账号信息
  ASSUSER_URL = '/admin/acl/user/save',
  //更新已有的账号信息
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取全部职位，当前账号拥有的职位接口
  ALLROLEURL = '/admin/acl/user/toAssign/',
  //给已有的用户分配角色接口
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除的接口
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

// 获取用户账号信息的接口方法（第三个参数可选，用 params 方式拼接查询参数）
export const reqUserInfo = (page: number, limit: number, username?: string) => {
  return request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}`,
    {
      params: username ? { username } : {},
    },
  )
}

//新增或修改账户信息的接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ASSUSER_URL, data)
  }
}

//当前账号拥有的职位接口
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

//分配职位
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)

//删除某一个职位
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

//批量删除某一个职位
export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
