import React from "react";
import './login.sass';
import logo from "./images/2.jpeg"
import { Form, Icon, Input, Button, message } from 'antd';
import {reqLogin} from "../../api"
import storageUtils from "../../utils/storageUtils.js"
import memoryUtils from "../../utils/memoryUtils";
import { Redirect } from "react-router-dom";

//登陆的路由组建
 class Login extends React.Component{
    handleSubmit = e => {
        e.preventDefault();
        // this.props.form.validateFields((err, values) => {
        //   if (!err) {
        //     const {username,password} = values;
        //     reqLogin(username,password).then(response => {
        //         console.log("chenggong",response.data);
        //     }).catch(error => {
        //         console.log("shibai",error)
        //     })
        //   }else{
        //       console.log("校验失败！")
        //   }
        // });
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
              const {username,password} = values;
                const data = await reqLogin(username,password);
                if(data.status === 0){
                    message.success("登陆成功");
                    const user = data.data;
                    storageUtils.saveUser(user);
                    this.props.history.replace("/");//因为不需要再回退，所以使用replace，需要回退使用push
                }else{
                    message.error("登陆失败");
                }
            }else{
                console.log("校验失败！")
            }
          });
      };
    validatePwd = (rule,value,callback) => {
        //callback()验证成功  callback(xxxx)验证失败
        if(!value){
            callback("请输入密码！");
        }else if(value.length<4){
            callback("密码至少4位！");
        }else if(value.length>12){
            callback("密码长度不能超过12位！");
        }else if(/^[a-zA-Z0-9_]+$/.test(value)){
            callback();
        }else{
            callback("密码必须是字母，下划线，数字！")
        }
    }
    render(){
        const user = memoryUtils.user;
        if(user._id){
            return <Redirect to="/"/>
        }
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt=""/>
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-section">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [
                                //声明式验证：直接使用别人定义好的验证规则进行验证
                                { required: true, whitespace:true,message: '请输入用户名!'},
                                { max: 12, message: '用户名应少于12个字符!'},
                                { min: 4, message: '用户名至少4个字符!'},
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是字母下划线数字!'}
                            ]})(
                            <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ 
                                validator:this.validatePwd
                             }],
                        })(
                            <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                            />,
                        )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: "100%"}}>
                                登陆
                            </Button>
                            </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Form.create()(Login);
