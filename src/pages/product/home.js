import React from "react";
import { Card ,Table,Select,Input,Icon,Button, message} from 'antd';
import LinkButton from "../../components/linkButton/linkButton.js"
import { reqProducts ,reqDescProduct,reqUpdateStatus} from "../../api/index.js";
const { Option } = Select;


//商品主页
 export default class ProductHome extends React.Component{
     state={
        products:[],
        pagination:{},
        loading:false,
        searchType:"",//搜索类型
        searchName:""//搜索关键字
     }
     getColumns = () =>{
        this.columns = [
            {
              title: '商品名称',
              dataIndex: 'name',
            },
            {
              title: '商品描述',
              dataIndex: 'desc',
            },
            {
              title: '价格',
              dataIndex: 'price',
              width: 100,
              render: (price) => "¥"+price,
            },
            {
                title: '状态',
                width: 100,
                render: (product) => {
                        return (
                            <span>
                                <Button type="primary" onClick={()=>this.changeStatus(product)}> {product.status === 1?"下架":"上架"}</Button>
                                <span> {product.status === 1?"已下架":"在售"}</span>
                            </span>
                        )
                }
            },
            {
                title: '操作',
                dataIndex: '',
                width: 100,
                render: (product) => {
                    return (
                        <span>
                        <LinkButton onClick={()=>this.props.history.push("/product/detail",{product})}> 详情</LinkButton>
                        <LinkButton onClick={()=>this.props.history.push("/product/addUpdate",{product})}>修改</LinkButton>
                    </span>
                    )
                }
            },
          ]
     }
     changeStatus = async(product) =>{
         const result = await reqUpdateStatus(product._id,product.status === 1?2:1);
         if(result.status === 0){
             message.success("更新成功");
             this.getProduct(this.pageNum);
         }
     }
   
     getProduct = async(pageNum) =>{
         this.pageNum = pageNum;
        const {searchType,searchName} =this.state;
        this.setState({
            loading:true
        })
        let result;
        if(!searchName){
             result = await reqProducts(pageNum,3);
        }else{
             result = await reqDescProduct({pageNum,pageSize:2,searchName,searchType})
        }
        
        this.setState({
            loading:false
        })
        if(result.status === 0){
            this.setState({
                products:result.data.list,
                pagination:result.data.total
            })
        }                                        
     }
    
     componentWillMount(){
        this.getColumns()
      }
     componentDidMount(){
        this.getProduct(1);
     }
     render(){
         const {products,pagination,loading,searchName} = this.state;
         const title=(
            <div>
                <Select defaultValue="请选择"style={{width:130,marginRight:20}} onChange={value=>this.setState({searchType:value})}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input placeholder="关键字" style={{width:150,marginRight:20}} value={searchName} onChange={e=>this.setState({searchName:e.target.value})}/>
                <Button type="primary" onClick={()=>this.getProduct(1)}>搜索</Button>
            </div>
         );
         const extra = (
                <Button type="primary" onClick={()=>this.props.history.push("/product/addUpdate")}><Icon type="plus"></Icon>添加商品</Button>
         );
        
         return(
             <div className="product-home"> 
                 <Card title={title} extra={extra} style={{ width: "100%" }}>
                    <Table 
                    rowKey="_id"
                    loading ={loading}
                    dataSource={products} 
                    columns={this.columns}
                    pagination={{
                        defaultPageSize:3,
                        total:pagination,
                        onChange:(pageNum) =>this.getProduct(pageNum)
                    }}
                    />
                  </Card>
             </div>
         )
     }
 }