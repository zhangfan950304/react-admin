//能发送异步ajax请求的函数模块 封装axios库
//函数的返回值是promise对象
//统一处理请求异常：在外层包一个自己创建的promise对象，在请求出错时，不reject（error），而是显示出错提示
import { message } from "antd";
import axios from "axios";

export default function ajax(url ,data={},type="GET"){
    return new Promise((resolve,reject) => {
        let promise;
        if(type === "GET"){
            promise = axios.get(url,{
                params:data
            })
        }else{
            promise = axios.post(url,data)
        }
        promise.then(respose => {
            resolve(respose.data);
        }).catch(error => {
            message.error("请求出错了：",error.message);
         })
    })
}