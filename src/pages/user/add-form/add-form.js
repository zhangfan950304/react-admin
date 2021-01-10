import React from "react";
import { Form, Input,Select} from 'antd';
import PropTypes from "prop-types";
const { Option } = Select;
class AddForm extends React.Component{
    static propTypes ={
        setForm:PropTypes.func.isRequired,
        roleList:PropTypes.array.isRequired,
        userList:PropTypes.object.isRequired
    }
   
    handleChange =()=>{

    }
    componentWillMount(){
        this.props.setForm(this.props.form);//将form对象通过setFrom（）传递父组件
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const {roleList,userList} = this.props;
        const user = userList || {}
        return(
            <div>
                <Form>
                    <Form.Item  label="用户名" labelCol={{span:4}} wrapperCol={{span:16}} >
                        {getFieldDecorator('username', {
                            rules: [
                            {
                                required: true,
                                message: '该项不能为空',
                            },
                            ],
                            initialValue:user.username
                        })(<Input placeholder="请输入用户名" />)}
                    </Form.Item>
                    {user._id?null:<Form.Item  label="密码" labelCol={{span:4}} wrapperCol={{span:16}} >
                        {getFieldDecorator('password', {
                            rules: [
                            {
                                required: true,
                                message: '该项不能为空',
                            },
                            ],
                            initialValue:user.password
                        })(<Input type="password" placeholder="请输入密码" />)}
                    </Form.Item>}
                    <Form.Item  label="手机号" labelCol={{span:4}} wrapperCol={{span:16}} >
                        {getFieldDecorator('phone', {
                            rules: [
                            {
                                required: true,
                                message: '该项不能为空',
                            },
                            ],
                            initialValue:user.phone
                        })(<Input placeholder="请输入手机号" />)}
                    </Form.Item>
                    <Form.Item  label="邮箱" labelCol={{span:4}} wrapperCol={{span:16}} >
                        {getFieldDecorator('email', {
                            rules: [
                            {
                                required: true,
                                message: '该项不能为空',
                            },
                            ],
                            initialValue:user.email
                        })(<Input placeholder="请输入邮箱" />)}
                    </Form.Item>
                    <Form.Item  label="角色" labelCol={{span:4}} wrapperCol={{span:16}} >
                        {getFieldDecorator('role_id', {
                            rules: [
                            {
                                required: true,
                                message: '该项不能为空',
                            },
                            ],
                            initialValue:user.role_id
                        })(<Select
                            placeholder="Please select"
                            initialValue={['a10']}
                            onChange={this.handleChange}
                          >
                            {roleList.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)}
                            </Select>
                            )}
                    </Form.Item>
                </Form>
                    
            </div>
        )
    }
}
export default Form.create()(AddForm);