//根据接口文档定义接口请求
//包含应用中所有接口请求函数的模块
//每个函数的返回值都是promise

import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
const BASE = "http://120.55.193.14:5000"
export const  reqLogin = (username, password) => ajax(BASE+"/login",{username,password},"POST");

export const  reqAddUser = (user) => ajax(BASE+"/manage/user/add",user,"POST");

//jsonp请求的接口请求函数
export const reqWeather = (city) => {
    return new Promise((resolve,reject) =>{
        const url= `https://tianqiapi.com/api?version=v6&appid=79232773&appsecret=Sdtc9yxM&cityid={city}`;
        jsonp(url,{},(err,data) =>{
            if(!data.errcode){
                const{wea,tem,tem2} = data;
                resolve({wea,tem,tem2});
            }else{
                message.error("获取天气失败");
            }
        } )
    })
}

//获取品类数据
export const reqCategory = (parentId) => ajax(BASE + "/manage/category/list",{parentId});
//添加分类
export const reqAddCategory = (categoryName,parentId) => ajax(BASE + "/manage/category/add",{categoryName,parentId},"POST");
//更新分类
export const reqUpdateCategory = (parentId,categoryName) => ajax(BASE + "/manage/category/update",{parentId,categoryName},"POST");
//获取一个分类
export const reqCategotyInfo = (categoryId) => ajax(BASE + "/manage/category/info",{categoryId})
//获取商品分页列表
export const reqProducts = (pageNum,pageSize) =>ajax(BASE + "/manage/product/list",{pageNum,pageSize})
//商品分页
export const reqDescProduct = ({pageNum,pageSize,searchName,searchType}) => ajax(BASE +"/manage/product/search",{pageNum,pageSize,[searchType]:searchName})
//更新商品状态
export const reqUpdateStatus = (productId,status) => ajax(BASE +"/manage/product/updateStatus",{productId,status},"POST")
//删除img
export const reqDeleteImg = (name) => ajax(BASE +"/manage/img/delete",{name},"POST")
//添加商品或删除商品
export const reqAddOrProduct = (product)=>ajax (BASE +"/manage/product/"+(product._id?"update":"add"),product,"POST")
//修改商品
// export const reqUpdateProduct = (product)=>ajax (BASE +"/manage/product/update",product,"POST")
//获取role的所有数据
export const reqRoleList =() =>ajax(BASE +"/manage/role/list")
//添加角色
export const reqAddRole = (roleName) => ajax(BASE +"/manage/role/add",{roleName},"POST")
//更新
export const reqUpdateRole = (role) => ajax(BASE +"/manage/role/update",role,"POST")
//获取用户列表
export const reqUserList =() =>ajax(BASE +"/manage/user/list")
//删除用户
export const reqDeleteUser =(userId) =>ajax(BASE +"/manage/user/delete",{userId},"POST")
//添加接口
export const reqAddUsers =(user) =>ajax(BASE +"/manage/user/add",user,"POST")
//更新接口
export const reqUpdateUser =(user) =>ajax(BASE +"/manage/user/update",user,"POST")