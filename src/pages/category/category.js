import React from "react";
import "./category.sass";
import { Card ,Button,Table, Icon, message,Modal} from 'antd';
import LinkButton from "../../components/linkButton/linkButton.js";
import {reqCategory,reqAddCategory,reqUpdateCategory} from "../../api/index.js";
import SelectForm from "./selectFrom.js"
import AddForm from "./addForm.js"

//商品分类
 export default class Category extends React.Component{
     state = {
         categorys : [],//一级分类数组
         subCategorys:[],//二级分类列表
         loading:false,
         parentId:"0",
         parentName:"",
         showStatus:0,//0:motaikuang都不显示，1:显示添加的，2显示更新的
         categ:""
     }
     initCol= () =>{
        this.columns = [
            {
              title: '分类的名称',
              dataIndex: 'name',
              
            },
            {
                title: '操作',
                dataIndex: '',
                width: 300,
                render: (text) => (
                    <span>
                        <LinkButton onClick={()=>this.showUpdateModel(text)}> 修改分类</LinkButton>
                        {this.state.parentId === "0"?<LinkButton onClick={()=>this.viewSubCategory(text)}>查看子分类 </LinkButton>:null}
                    </span>
                ),
            },
          ];
     }
     viewSubCategory = (text) => {
         this.setState({//是异步更新状态的
             parentId:text._id,
             parentName:text.name
         },()=>{//在状态更新完以后在调用下面方法
            this.getCategory();
         })
     }
     showfirstCategory =()=>{
         this.setState({
             parentId:"0",
             parentName:"",
             subCategorys:[]
         })
     }
     //获取分类列表（一级/二级）
     getCategory = async(categoryId) =>{
         const parentId = categoryId||this.state.parentId;
         // 请求前loading
        const result = await reqCategory(parentId);
        //请求后loading消失
        this.setState({
            loading:true
        })
        if(!result.status === 0){
            message.error("获取信息失败");
        }else{
            if(parentId === "0"){
                this.setState({
                    categorys:result.data
                })
            }else{
                this.setState({
                    subCategorys:result.data
                })
            }
            
        }
     }
     showAddModel = () => {
         this.setState({
             showStatus :1
         })
     }
     showUpdateModel = (text) =>{
        this.category = text;//保存分类对象
        this.setState({
            showStatus :2
        })
     }
     setModalVisible = () =>{
        this.form.resetFields();//清除输入数据
        this.setState({
            showStatus :0
        })
        
     }
     //确认添加
     handleAdd = () =>{
        this.form.validateFields(async(err,values) =>{
            if(!err){
                this.setState({
                    showStatus :0
                 })
                // const {categoryId,categoryName} = this.form.getFieldsValue();//该form是由子组件通过函数传递过来的
                const {categoryId,categoryName} = values;
                 this.form.resetFields();//清除输入数据
        
                 //发请求
                 const result = await reqAddCategory(categoryName,categoryId);
                 if(result.status === 0){
                     if(categoryId === this.state.parentId){
                         //更新显示列表
                        this.getCategory();
                     }else if(categoryId === "0"){
                        this.getCategory(categoryId);
        
                     }
                 }
            }
        })
     }
     //确认更新
     handleUpdate = () =>{
        this.form.validateFields(async(err,values) =>{
            if(!err){
                this.setState({
                    showStatus :0
                 })
                 const categoryId = this.category._id;
               //  const categoryName = this.form.getFieldValue("categoryName");//该form是由子组件通过函数传递过来的
               const {categoryName} = values;
                 this.form.resetFields();//清除输入数据
        
                 //发请求
                 const result = await reqUpdateCategory({categoryId,categoryName});
                 if(result.status === 0){
                      //更新显示列表
                      this.getCategory();
                 }
            }
        })
     }
     componentWillMount(){
         this.initCol();
     }
     componentDidMount(){
         this.getCategory();
     }
     render(){
        const {categorys,subCategorys,parentId,parentName,showStatus} = this.state;
         const title = parentId === 0?"一级分类列表":(
             <span>
                 <LinkButton onClick ={this.showfirstCategory}> 一级分类列表 </LinkButton> 
                 <Icon type="arrow-right" style={{marginRight:"10px"}}></Icon>
                 {parentName}
             </span>
            
         );
         let extra = (<Button type="primary" onClick={this.showAddModel}>
             <Icon type="plus"></Icon>
                添加
             </Button>)
        let categ="";
    
        if(this.category !== undefined){
            categ = this.category;
        }
         return(
            
             <div className="category"> 
                  <Card title={title} extra={extra} style={{ width: "100%" }}>
                        <Table 
                          bordered 
                          rowKey="_id" 
                          dataSource={parentId ==="0"?categorys:subCategorys} 
                          columns={this.columns} 
                          pagination={{defaultPageSize:5}}
                          loading={this.setState.loading}
                        />
                         <Modal
                            title="添加分类"
                            style={{ top: 20 }}
                            visible={showStatus === 1}
                            onOk={this.handleAdd}
                            onCancel={this.setModalVisible}
                            >
                            <AddForm categorys={categorys} parentId={parentId} setForm={(form)=>this.form = form}></AddForm>
                        </Modal>
                        <Modal
                            title="更新分类"
                            style={{ top: 20 }}
                            visible={showStatus === 2}
                            onOk={this.handleUpdate}
                            onCancel={this.setModalVisible}
                            >
                            <SelectForm categoryName={categ.name} setForm={(form)=>this.form = form}></SelectForm>
                        </Modal>
                        
                 </Card>
             </div>
         )
     }
 }