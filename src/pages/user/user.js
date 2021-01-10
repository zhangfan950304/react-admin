import React from "react";
import { Button, Card ,message,Table,Modal} from 'antd';
import {reqUserList,reqDeleteUser,reqUpdateUser,reqAddUsers} from "../../api/index"
import AddForm from "./add-form/add-form.js"
import {formateDate} from "../../utils/dateUtils.js"
import LinkButton from "../../components/linkButton/linkButton.js"
//用户管理路由
 export default class User extends React.Component{
     state ={
        userList:[],
        roleList:[],
        isShow : false,
        isAdd:false
     }
    initColumns =()=>{
        this.columns = [
            {
              title: '用户名',
              dataIndex: 'username',
            },{
                title: '邮箱',
                dataIndex: 'email',
              },{
                title: '电话',
                dataIndex: 'phone',
              },
            {
              title: '注册时间',
              dataIndex: 'create_time',
              render: (text) => formateDate(text)
            },
            {
              title: '所属角色',
              dataIndex: 'role_id',
              render:(role_id)=>this.roleName[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={()=>this.addUser(user)}>修改</LinkButton>
                        <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
              },
          ];
     }
     deleteUser=(user)=>{
         Modal.confirm({
             title:`确认删除${user.username}`,
             onOk:async()=>{
                const result = await reqDeleteUser(user._id);
                if(result.status === 0){
                    message.success("删除成功");
                    this.getUserList()
                }else{
                    message.error("删除失败");
                }
             }
         })
     }
    
     initRoleNames=(roles)=>{
         const roleName = roles.reduce((pre,role)=>{
            pre[role._id] = role.name;
            return pre
         },{})
          this.roleName=roleName;
     }
     getUserList=async()=>{
         const result = await reqUserList();
         this.initRoleNames(result.data.roles)
         if(result.status === 0){
             this.setState({
                userList:result.data.users,
                roleList:result.data.roles
             })
             
         }
     }
     addUser=(info)=>{
         if(info === 0){
             this.userObject = null;//否则内存中一直存在需要修改的内容
            this.setState({
                isShow:true,
                isAdd: true
            })
            
         }else{
            this.userObject=info
            this.setState({
                isShow:true,
                isAdd: false
            })
         }
        
     }
     setModalVisible=()=>{
         this.setState({
            isShow:false,
         })
         this.form.resetFields();//清除输入数据
     }
     handleAdd =()=>{
        this.form.validateFields(async(err,values) =>{
            if(!err){
                const user = values;
                this.form.resetFields();
                if(this.userObject){
                    user._id = this.userObject._id;
                    const result = await reqUpdateUser(user);
                    if(result.status === 0){
                        message.success("修改成功");
                        this.getUserList();
                        this.setState({
                            isShow:false,
                        })
                    }else{
                        message.error("修改失败");
                    }
                }else{
                    const result = await reqAddUsers(user);
                    if(result.status === 0){
                        message.success("添加成功");
                        this.getUserList();
                        this.setState({
                            isShow:false,
                        })
                    }else{
                        message.error("添加失败");
                    }
                }
                
            }
        })
     }
     componentWillMount(){
        this.initColumns()
     }
     componentDidMount(){
        this.getUserList()
     }
     render(){
        const {userList,isShow,isAdd,roleList}= this.state;
        const title =(
            <div>
                <Button type="primary" style={{marginRight:10}} onClick={()=>this.addUser(0)}> 创建用户</Button>
            </div>
        )
         return(
            <Card title={title}>

                <Table  
                rowKey="_id"
                pagination={{defaultPageSize:5}}
                columns={this.columns} 
                dataSource={userList} 
                />;
            <Modal
                title={isAdd?"添加用户":"修改用户"}
                style={{ top: 20 }}
                visible={isShow}
                onOk={this.handleAdd}
                onCancel={this.setModalVisible}
                >
                <AddForm roleList={roleList} userList={this.userObject}setForm={(form)=>this.form = form}></AddForm>
            </Modal>
        </Card>
     )
     }
 }
 
 
    
    