import React from "react";
// import { Redirect } from "react-router-dom";
// import memoryUtils from "../../utils/memoryUtils.js"
import { Layout} from 'antd';
import Header from "../../components/header/header.js";
import LeftNav from "../../components/left-nav/left-nav.js";
import Bar from "../chart/bar.js";
import Line from "../chart/line.js";
import Pie from "../chart/pie.js";
import Role from "../role/role.js";
import User from "../user/user.js";
import Category from "../category/category.js";
import Product from "../product/product.js";
import Home from "../home/home.js";
import {Redirect, Route,Switch} from "react-router-dom";

const {  Content, Footer, Sider } = Layout;

//后台管理的路由组建
export default class Admin extends React.Component{
    render(){
        // const user = memoryUtils.user;
        // if(!user._id){
        //     return <Redirect to="/login"></Redirect>
        // }
        // return(
        //     <div>
        //         hello,{user.username}
        //     </div>
        // )
        return(
            <Layout style={{minHeight:"100%"}}>
            <Sider>
                <LeftNav></LeftNav>
            </Sider>
            <Layout>
              <Header>Header</Header>
              <Content style={{backgroundColor:"#fff",margin:"20px 20px 0px 20px"}}>
                <Switch>
                    <Route path="/home" component={Home}/>
                    <Route path="/category" component={Category}/>
                    <Route path="/product" component={Product}/>
                    <Route path="/user" component={User}/>
                    <Route path="/role" component={Role}/>
                    <Route path="/pie" component={Pie}/>
                    <Route path="/line" component={Line}/>
                    <Route path="/bar" component={Bar}/>
                    <Redirect to="/home"/>
                </Switch>
              </Content>
              <Footer style={{textAlign:"center"}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
            </Layout>
          </Layout>
         )
    }
   
}