import React from "react";
import { Form, Input } from 'antd';
import PropTypes from "prop-types";
class SelectForm extends React.Component{
    static propTypes ={
        categoryName:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    } 
    componentWillMount(){
        this.props.setForm(this.props.form);//将form对象通过setFrom（）传递父组件
    }
    render(){
        const  {categoryName} = this.props;
        const { getFieldDecorator } = this.props.form;
        return(
            <div>
                <Form.Item  label="分类名称">
                    {getFieldDecorator('categoryName', {
                        rules: [
                            {
                                required: true,
                                message: '分类名称不能为空',
                            },
                        ],
                        initialValue:categoryName
                    })
                    (<Input  />)}
                </Form.Item>
            </div>
        )
    }
}
export default Form.create()(SelectForm);