import React from "react";
import "./header.sass"
import {formateDate} from "../../utils/dateUtils.js"
import memoryUtils from "../../utils/memoryUtils.js"
import {reqWeather} from "../../api/index.js"
import{withRouter} from "react-router-dom"
import menuList from "../../config/menuConfig.js"
import { Modal } from 'antd';
import storageUtils from "../../utils/storageUtils.js"
import LinkButton from "../linkButton/linkButton.js"
const { confirm } = Modal;

 class Header extends React.Component{
     state = {
         currentTime:formateDate(Date.now()),
         weather:"",//天气
         tem:"",//气温
         tem2:""//气温
       
    
     }
     //退出
     logout = () =>{
        confirm({
            title: '确定退出吗?',
            onOk:() =>{
              memoryUtils.user = {};
              storageUtils.delUser();
              this.props.history.replace("/login");
            },
            onCancel() {
              //console.log('Cancel');
            },
          });
     }
    
     getTitle = () =>{
         const path = this.props.location.pathname;
         let title ="";
         menuList.forEach((item) => {
             if(item.key === path){
                 title = item.title;
             }else if(item.children){
                const name = item.children.find(cname => path.indexOf(cname.key) !== -1);
                if(name){
                    title = name.title;
                }
             }
         })
         return title;
     }
     getTime = () =>{
        this.intervalId=setInterval(() => {
            const currentTime = formateDate(Date.now());
            this.setState({currentTime})
       },1000)
     }
     getWeather = async() =>{
        const {wea,tem,tem2} = await reqWeather("北京");
        this.setState({
            weather:wea,
            tem:tem,
            tem2:tem2
        })
     }
     componentDidMount(){//一般在此进行发ajax请求和启动定时器
        this.getTime();
        this.getWeather();
     }
     componentWillUnmount(){
         clearInterval(this.intervalId)
     }
     render(){
         const user = storageUtils.getUser();
         const title = this.getTitle();
         return(
             <div className="header"> 
                 <div className="header-top">
                    <span>欢迎,{user.username}</span>
                    <span><LinkButton onClick={this.logout}>退出</LinkButton></span>
                 </div>
                 <div className="header-bottom">
                    <div className="header-bottom-top">
                            {title}
                    </div>
                    <div className="header-bottom-bottom">
                        <span>{this.state.currentTime}</span>
                        <span>{this.state.weather}</span>
                        <span>气温：{this.state.tem2}℃ 至{this.state.tem}℃</span>
                    </div>
                 </div>
             </div>
         )
     }
 }
 export default withRouter(Header);