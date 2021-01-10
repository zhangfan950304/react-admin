import React from "react";
import ProductAddUpdate from "./add-update.js";
import ProductHome from "./home.js";
import ProductDetail from "./detail.js";
import {Redirect, Route,Switch} from "react-router-dom"
import "./product.sass"
//商品路由
 export default class Product extends React.Component{
     render(){
         return(
             <div className="product"> 
                 <Switch>
                    <Route exact path="/product" component={ProductHome}></Route>{/*exact精确匹配 */}
                    <Route path="/product/addUpdate" component={ProductAddUpdate}></Route>
                    <Route path="/product/detail" component={ProductDetail}></Route>
                    <Redirect to="/product"></Redirect>
                 </Switch>
             </div>
         )
     }
 }