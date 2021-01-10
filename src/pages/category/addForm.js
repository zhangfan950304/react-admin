import React from "react";
import { Form, Input,Select} from 'antd';
import PropTypes from "prop-types";
const { Option}= Select;
class AddForm extends React.Component{
    static propTypes ={
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        setForm:PropTypes.func.isRequired
    }
    componentWillMount(){
        this.props.setForm(this.props.form);//将form对象通过setFrom（）传递父组件
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        let arr=[];
        this.props.categorys.forEach((element) => {
            arr.push(<Option value={element._id}>{element.name}</Option>) 
        })
        return(
            <div>
                <Form.Item  label="所属分类">
                    {getFieldDecorator('categoryId', {
                        initialValue :this.props.parentId
                    })
                    (<Select style={{width:"100%"}}>
                        <Option value="0">一级分类</Option>
                       {arr}
                    </Select>)}
                    </Form.Item>
                    <Form.Item  label="分类名称">
                    {getFieldDecorator('categoryName', {
                        rules: [
                        {
                            required: true,
                            message: '分类名称不能为空',
                        },
                        ],
                    })(<Input placeholder="请输入分类名称" />)}
                </Form.Item>
            </div>
        )
    }
}
export default Form.create()(AddForm);