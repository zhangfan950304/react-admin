import React from "react";
import {Card, Icon,List} from 'antd';
import {reqCategotyInfo} from "../../api/index.js"
const Item =List.Item;



//商品路由
 export default class ProductDetail extends React.Component{
    state={
        cname1 :"",
        cname2 :""
     }

    callBackPage = ()=>{
        this.props.history.goBack();
    }
    getCateInfo =async() =>{
        const {pCategoryId,categoryId} = this.props.location.state.product;
        let result;
        if(pCategoryId === "0"){//一级分类
             result = await reqCategotyInfo(categoryId);
             this.setState({
                cname1:result.data.name
             })
        }else{//二级分类
            // result = await reqCategotyInfo(pCategoryId);
            // const restt = await reqCategotyInfo(categoryId);
            // this.setState({
            //     cname1:result.data.name,
            //     cname2:restt.data.name
            // })
            result = await Promise.all([reqCategotyInfo(pCategoryId),reqCategotyInfo(categoryId)]);
            this.setState({
                cname1:result[0].data.name,
                cname2:result[1].data.name
            })

        }
        
    }
    componentDidMount(){
        this.getCateInfo();
    }
     render(){
         const title =(
             <span>
                 <Icon type="arrow-left" style={{marginRight:15,color:"green"}} onClick={this.callBackPage}/>
                 <span>商品详情</span>
             </span>
         );
         const {name,desc,price,detail,imgs} = this.props.location.state.product;
         const {cname1,cname2}= this.state;
         return(
            <Card title={title} className="product-detail">
                <List>
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">价格：</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>{cname1}{cname2?"-->"+cname2:""}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        <span>
                           {imgs.map(item =>(
                               <img
                                  key={item}
                                  src={"http://120.55.193.14:5000/upload/"+item}
                                  alt="img"
                               />
                           ))}
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{__html:detail}}>
                        </span>
                    </Item>
                </List>
          </Card>
         )
     }
 }