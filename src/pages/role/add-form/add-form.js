import React from "react";
import { Form, Input} from 'antd';
import PropTypes from "prop-types";
class AddForm extends React.Component{
    static propTypes ={
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form);//将form对象通过setFrom（）传递父组件
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Form>
                    <Form.Item  label="创建角色" labelCol={{span:4}} wrapperCol={{span:16}} >
                        {getFieldDecorator('roleName', {
                            rules: [
                            {
                                required: true,
                                message: '分类名称不能为空',
                            },
                            ],
                        })(<Input placeholder="请输入角色名称" />)}
                    </Form.Item>
                </Form>
                    
            </div>
        )
    }
}
export default Form.create()(AddForm);