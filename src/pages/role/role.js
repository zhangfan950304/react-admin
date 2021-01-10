import React from "react";
import { Button, Card ,message,Table,Modal} from 'antd';
import {reqRoleList,reqAddRole,reqUpdateRole} from "../../api/index"
import AddForm from "./add-form/add-form.js"
import SetForm from "./set-form/set-form.js"
import {formateDate} from "../../utils/dateUtils.js"
import storageUtils from "../../utils/storageUtils.js"
//角色路由
 export default class Role extends React.Component{
     state ={
        roleList : [],
        role:{},//选中的role
        showStatus:0
     }
     constructor(props){
         super(props);
         this.auth = React.createRef();
     }
     initColumns =()=>{
        this.columns = [
            {
              title: '角色名称',
              dataIndex: 'name',
            },
            {
              title: '创建时间',
              dataIndex: 'create_time',
              render: (text) => formateDate(text)
            },
            {
              title: '授权时间',
              dataIndex: 'auth_time',
              render: (text) => formateDate(text)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
              },
          ];
     }
     getRoleList =async()=>{
      const result = await reqRoleList();
      if(result.status === 0){
          this.setState({
            roleList:result.data
          })
      }else{
          message.error("获取数据失败")
      }
     }
     onRow =(role)=>{
        return {
            onClick:event=>{//点击行
                this.setState({
                    role:role
                })
            }
        }
     }
     addRole =()=>{
         this.setState({
            showStatus:1
         })
     }
     setRole =()=>{
        this.setState({
            showStatus:2
         })
     }
     handleAdd =() =>{
        this.form.validateFields(async(err,values) =>{
            if(!err){
                const {roleName} = values;
                this.form.resetFields();//清除输入数据
                const result = await reqAddRole(roleName);
                if(result.status === 0){
                    message.success("添加成功");
                    this.setState({
                        showStatus:0
                     })
                   // this.getRoleList();//或者将返回的数据追加到rolelist数组中更新state
                   this.setState({
                       roleList:[...this.state.roleList,result.data]
                   })
                    
                }else{
                    message.error("添加失败");
                }
            }else{
                message.error("添加失败");
            }
        })
        
     }
     setModalVisible=()=>{
        this.form.resetFields();//清除输入数据
         this.setState({
            showStatus:0
         })
     }
     handleSet=async()=>{
         const role = this.state.role;
        const auth= this.auth.current.getCheckedList();
        role.menus = auth;
        role.auth_name = storageUtils.getUser().username;
        const result = await reqUpdateRole(role);
        this.setState({
            showStatus:0
         })
        if(result.status === 0){
           
            //如果更新的是用户自己的角色，需要清除数据，重新登陆
            console.log(role._id ,storageUtils.getUser().role_id)
            if(role._id === storageUtils.getUser().role_id){
                storageUtils.delUser();
                message.success("当前用户角色更新成功，请重新登陆");
                this.props.history.replace("/login")
            }else{
                message.success("更新成功");
            }
            this.getRoleList();//或者将返回的数据追加到rolelist数组中更新state
        }else{
            message.error("失败")
        }
     }
     setModal =()=>{
        this.setState({
            showStatus:0
         })
     }
     componentWillMount(){
        this.initColumns()
     }
     componentDidMount(){
        this.getRoleList()
     }
     render(){
         const {roleList,role,showStatus} = this.state
         const title =(
             <div>
                 <Button type="primary" style={{marginRight:10}} onClick={this.addRole}> 创建角色</Button>
                 <Button type="primary" disabled={!role._id} onClick={this.setRole}>设置角色权限</Button>
             </div>
         )
         
         return(
            <Card title={title}>

                <Table  
                rowKey="_id"
                pagination={{defaultPageSize:5}}
                columns={this.columns} 
                dataSource={roleList} 
                rowSelection={{type:"radio",selectedRowKeys:role._id,onSelect:(role)=>{
                    this.setState({
                        role:role
                    })
                }}}
                onRow={this.onRow}
                />;
                <Modal
                    title="添加分类"
                    style={{ top: 20 }}
                    visible={showStatus === 1}
                    onOk={this.handleAdd}
                    onCancel={this.setModalVisible}
                    >
                    <AddForm setForm={(form)=>this.form = form}></AddForm>
                </Modal>
                <Modal
                    title="设置角色权限"
                    style={{ top: 20 }}
                    visible={showStatus === 2}
                    onOk={this.handleSet}
                    onCancel={this.setModal}
                    >
                    <SetForm role ={role} ref={this.auth}></SetForm>
                </Modal>
            </Card>
         )
     }
 }