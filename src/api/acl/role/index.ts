import request from '@/utils/request'
import type { MenuResponseData, RoleData, RoleResponseData } from './type'

//角色管理模块的接口
enum API {
  //获取全部职位的接口
  ALLROLE_URL = '/admin/acl/role/',
  //新增岗位的接口地址
  ADDROLE_URL = '/admin/acl/role/save',
  //更新已有的职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取全部的菜单与按钮的数据
  ALLPERMISSTION = '/admin/acl/permission/toAssign/',
  //给相应的职位分配权限
  SETPERMISTION_URL = '/admin/acl/permission/doAssign',
  //删除已有的职位
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部职位的接口方法（第三个参数可选，用 params 方式拼接查询参数）
export const reqAllRoleList = (
  page: number,
  limit: number,
  roleName?: string,
) => {
  return request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}`,
    {
      params: roleName ? { roleName } : {},
    },
  )
}

//添加职位与更新已有职位接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

//获取全部菜单与权限的接口
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSTION + roleId)

//给相应的职位下发权限
export const reqSetPermisstion = (roleId: number, permissionId: number[]) => {
  // 根据 API 文档，roleId 和 permissionId 都是查询参数
  // 自定义参数序列化，将数组转换为多个同名参数：permissionId=1&permissionId=2
  return request.post<any, any>(
    API.SETPERMISTION_URL,
    {},
    {
      params: {
        roleId,
        permissionId,
      },
      paramsSerializer: (params) => {
        const parts: string[] = []
        for (const key in params) {
          const value = params[key]
          if (Array.isArray(value)) {
            // 数组转换为多个同名参数
            value.forEach((item) => {
              parts.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(item)}`,
              )
            })
          } else if (value !== null && value !== undefined) {
            parts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
            )
          }
        }
        return parts.join('&')
      },
    },
  )
}
//删除已有的职位
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)
