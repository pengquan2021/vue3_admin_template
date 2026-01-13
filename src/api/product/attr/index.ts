//属性相关api
import request from '@/utils/request'
import type { Attr, AttrResponseData, categoryResponseData } from './type'
//属性管理模块地址
enum API {
  //一级分类接口地址
  C1_URL = 'admin/product/getCategory1',
  //二级分类接口地址
  C2_URL = 'admin/product/getCategory2/',
  //三级分类接口地址
  C3_URL = 'admin/product/getCategory3/',
  //商品属性与属性值地址
  ATTR_URL = 'admin/product/attrInfoList/',
  //添加或修改已有属性的接口
  ADDORUPDATE_URL = 'admin/product/saveAttrInfo',
  //删除某一个已有的属性
  DELETEATTR_URL = 'admin/product/deleteAttr/',
}

//获取一级分类的接口方法
export const reqC1 = () => request.get<any, categoryResponseData>(API.C1_URL)
//获取二级分类的接口方法
export const reqC2 = (category1ID: number | string) =>
  request.get<any, categoryResponseData>(API.C2_URL + category1ID)
//获取三级分类的接口方法
export const reqC3 = (category2ID: number | string) =>
  request.get<any, categoryResponseData>(API.C3_URL + category2ID)
//获取商品属性与属性值接口方法
export const reqAttr = (
  category1ID: number | string,
  category2ID: number | string,
  category3ID: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1ID}/${category2ID}/${category3ID}`,
  )
//添加或修改属性和属性值的接口方法
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATE_URL, data)
//删除某一个属性的接口方法
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
