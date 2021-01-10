import React from "react";
import "./left-nav.sass"
import logo from "../../pages/login/images/2.jpeg";
import {Link,withRouter} from "react-router-dom";
import {  Menu, Icon } from 'antd';
import menuList from "../../config/menuConfig.js";
import storageUtils from "../../utils/storageUtils.js"


const { SubMenu } = Menu;
class LeftNav extends React.Component{
    hasAuth =(item)=>{//判断当前用户对item是否有权限
        const {key,isPublic} = item;
        const menus = storageUtils.getUser().role.menus;
        //console.log(storageUtils.getUser().role.menus)
        const username = storageUtils.getUser().username;
        if(username === "admin" || isPublic === true ||menus.indexOf(key) !== -1){
            return true
        }else if(item.children){
            return !!item.children.find(child => menus.indexOf(child.key) !== -1);
        }else{
            return false
        }
    }
    getMenuNodes = (list) => {
        const path = this.props.location.pathname;
        if(list){
            return list.map(item => {
                if(this.hasAuth(item)){//如果当前用户有item对应的权限，才需要显示对应的菜单项
                    if(!item.children){
                        return (
                            <Menu.Item key={item.key}>
                                <Link to={item.key}>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </Link>
                            </Menu.Item>
                        )
                    }else{
                        const openRoute=item.children.find(citem => path.indexOf(citem.key) === 0);
                        if(openRoute){
                            this.openKey = item.key;
                        }
                        return (
                            <SubMenu
                                key={item.key}
                                title={
                                    <span>
                                        <Icon type={item.icon} />
                                        <span>{item.title}</span>
                                    </span>
                                }
                            >
                                {this.getMenuNodes(item.children)}
                            </SubMenu>
                            
                        )
                    }
                }
            })
        }
        
    }
     render(){
         const menuNodes = this.getMenuNodes(menuList)
         let openPath = this.props.location.pathname;
         let openKey = this.openKey;
         if(openPath.indexOf("/product") === 0){
           // openKey = "/products";
            openPath ="/product"
         }
         
         return(
             <div className="left-nav">
                 <Link to="/" className="left-nav-header">
                    <img src={logo} alt=""/>
                    <h2>硅谷后台</h2>
                 </Link>
                 <section>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={[openPath]}
                        defaultOpenKeys={[openKey]}
                        style={{ height: '100%', borderRight: 0 }}
                        >
                        {menuNodes}
                        {/* <Menu.Item key="/home">
                            <Link to="/home">
                                <Icon type="user" />
                                <span>首页</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu
                            key="sub1"
                            title={
                            <span>
                                <Icon type="user" />
                                <span>商品</span>
                            </span>
                            }
                        >
                            <Menu.Item key="/category">
                                <Link to="/category"> 
                                    <Icon type="user" />
                                    <span>品类管理</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/product">
                                    <Icon type="user" />
                                    <span>商品管理</span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item key="/user">
                            <Link to="/user">
                                <Icon type="laptop" />
                                <span>用户管理</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/role">
                            <Link to="/role">
                                <Icon type="notification" />
                                <span>角色管理</span>
                            </Link>
                        </Menu.Item>
                        <SubMenu 
                            key="sub2"
                            title={
                            <span>
                                <Icon type="user" />
                                <span>图形图表</span>
                            </span>
                            }
                        >
                            <Menu.Item key="/bar">
                                <Link to="/bar">
                                    <Icon type="user" />
                                    <span>柱形图</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/line">
                                <Link to="/line">
                                    <Icon type="user" />
                                    <span>折线图</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/pie">
                                <Link to="/pie">
                                    <Icon type="user" />
                                    <span>饼图</span>
                                </Link>
                            </Menu.Item>
                        </SubMenu>*/}
                    </Menu>
                 </section>
             </div>
         )
     }
 }

 export default withRouter(LeftNav);